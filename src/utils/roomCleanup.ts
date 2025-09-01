// Thêm type để phân biệt loại phòng
export type RoomType = "Waiting" | "Match";

interface RoomCleanupData {
  roomId: string;
  userId: string;
  connectionId?: string;
  timestamp: number;
  type: RoomType; // Thêm trường type
}

export class RoomCleanupManager {
  private static readonly STORAGE_KEY = "room_cleanup_data";
  private static readonly CHECK_INTERVAL = 1000; // Check mỗi giây
  private static intervalId: number | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static connection: any = null;
  private static isInitialized = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static setConnection(connection: any) {
    this.connection = connection;

    // Auto init khi có connection
    if (connection && !this.isInitialized) {
      this.init();
    }
  }

  // Cập nhật method để thêm type
  static setRoomData(roomId: string, userId: string, type: RoomType) {
    const data: RoomCleanupData = {
      roomId,
      userId,
      timestamp: Date.now(),
      type, // Lưu type
    };
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));

    // Bắt đầu monitoring nếu chưa có
    if (!this.intervalId) {
      this.startMonitoring();
    }
  }

  static clearRoomData() {
    sessionStorage.removeItem(this.STORAGE_KEY);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static getRoomData(): RoomCleanupData | null {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  private static async performCleanup(data: RoomCleanupData) {
    try {
      if (this.connection && this.connection.state === "Connected") {
        // Phân loại xử lý dựa trên type
        if (data.type === "Match") {
          console.log(
            "Performing cleanup via SignalR - leaving match:",
            data.roomId
          );
          await this.connection.invoke(
            "HandleMatchOut",
            data.roomId,
            data.userId
          );
          console.log("Match cleanup performed successfully via SignalR");
        } else {
          // 'Waiting'
          console.log(
            "Performing cleanup via SignalR - leaving waiting room:",
            data.roomId
          );
          await this.connection.invoke("OutRoom", data.roomId, data.userId);
          console.log(
            "Waiting room cleanup performed successfully via SignalR"
          );
        }
      } else {
        console.warn("SignalR connection not available for cleanup");
      }
    } catch (error) {
      console.error(`SignalR ${data.type} cleanup failed:`, error);
    } finally {
      this.clearRoomData();
    }
  }

  private static shouldPerformCleanup(): boolean {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const roomData = this.getRoomData();

    if (!roomData) return false;

    // Các route được phép (không cần cleanup) dựa trên type
    let allowedPaths: string[];

    if (roomData.type === "Match") {
      allowedPaths = [
        "/match", // TOURNAMENT_MATCH
      ];
    } else {
      // 'Waiting'
      allowedPaths = [
        `/rooms/${roomData.roomId}`, // TOURNAMENT_WAITING_ROOM
      ];
    }

    // Kiểm tra path
    const isAllowedPath = allowedPaths.some((path) => {
      return currentPath === path || currentPath.startsWith(path);
    });

    // Kiểm tra match route với query param (chỉ cho type Match)
    const isMatchRoute =
      roomData.type === "Match" &&
      currentPath === "/match" &&
      currentSearch.includes(`roomId=${roomData.roomId}`);

    const shouldCleanup = !isAllowedPath && !isMatchRoute;

    if (shouldCleanup) {
      console.log(
        `Should perform ${roomData.type} cleanup - current path:`,
        currentPath,
        "current search:",
        currentSearch
      );
    }

    return shouldCleanup;
  }

  private static startMonitoring() {
    this.intervalId = window.setInterval(() => {
      if (this.shouldPerformCleanup()) {
        const roomData = this.getRoomData();
        if (roomData) {
          this.performCleanup(roomData);
        }
      }
    }, this.CHECK_INTERVAL);
  }

  static async forceCleanup() {
    const roomData = this.getRoomData();
    if (roomData) {
      await this.performCleanup(roomData);
    }
  }

  static init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Handle page visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        const roomData = this.getRoomData();
        if (roomData && this.shouldPerformCleanup()) {
          console.log(`Page hidden - performing ${roomData.type} cleanup`);

          // Thử SignalR trước
          if (this.connection && this.connection.state === "Connected") {
            try {
              // Không await vì page đang hidden
              if (roomData.type === "Match") {
                this.connection.invoke(
                  "HandleMatchOut",
                  roomData.roomId,
                  roomData.userId
                );
              } else {
                this.connection.invoke(
                  "OutRoom",
                  roomData.roomId,
                  roomData.userId
                );
              }
            } catch (error) {
              console.error(
                `SignalR ${roomData.type} cleanup on visibility change failed:`,
                error
              );
            }
          }

          this.clearRoomData();
        }
      }
    });

    // Handle beforeunload
    window.addEventListener("beforeunload", () => {
      const roomData = this.getRoomData();
      if (roomData && this.shouldPerformCleanup()) {
        console.log(`Before unload - performing ${roomData.type} cleanup`);

        // Thử SignalR (synchronous)
        if (this.connection && this.connection.state === "Connected") {
          try {
            // Không await vì beforeunload cần nhanh
            if (roomData.type === "Match") {
              this.connection.invoke(
                "HandleMatchOut",
                roomData.roomId,
                roomData.userId
              );
            } else {
              this.connection.invoke(
                "OutRoom",
                roomData.roomId,
                roomData.userId
              );
            }
          } catch (error) {
            console.error(
              `SignalR ${roomData.type} cleanup on beforeunload failed:`,
              error
            );
          }
        }
      }
    });

    // Handle popstate (back/forward button)
    window.addEventListener("popstate", () => {
      // Delay một chút để URL được update
      setTimeout(() => {
        if (this.shouldPerformCleanup()) {
          const roomData = this.getRoomData();
          if (roomData) {
            console.log(`Popstate - performing ${roomData.type} cleanup`);
            this.performCleanup(roomData);
          }
        }
      }, 100);
    });
  }

  // Method để stop monitoring (nếu cần)
  static stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Method để reset (nếu cần)
  static reset() {
    this.stopMonitoring();
    this.clearRoomData();
    this.isInitialized = false;
  }
}
