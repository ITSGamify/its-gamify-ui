interface RoomCleanupData {
  roomId: string;
  userId: string;
  connectionId?: string;
  timestamp: number;
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

  static setRoomData(roomId: string, userId: string) {
    const data: RoomCleanupData = {
      roomId,
      userId,
      timestamp: Date.now(),
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
        console.log(
          "Performing cleanup via SignalR - leaving room:",
          data.roomId
        );
        await this.connection.invoke("OutRoom", data.roomId, data.userId);
        console.log("Cleanup performed successfully via SignalR");
      } else {
        console.warn("SignalR connection not available for cleanup");
      }
    } catch (error) {
      console.error("SignalR cleanup failed:", error);
    } finally {
      this.clearRoomData();
    }
  }

  private static shouldPerformCleanup(): boolean {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const roomData = this.getRoomData();

    if (!roomData) return false;

    // Các route được phép (không cần cleanup)
    const allowedPaths = [
      "/match", // TOURNAMENT_MATCH
      `/rooms/${roomData.roomId}`, // TOURNAMENT_WAITING_ROOM
    ];

    // Kiểm tra path
    const isAllowedPath = allowedPaths.some((path) => {
      return currentPath === path || currentPath.startsWith(path);
    });

    // Kiểm tra match route với query param
    const isMatchRoute =
      currentPath === "/match" &&
      currentSearch.includes(`roomId=${roomData.roomId}`);

    const shouldCleanup = !isAllowedPath && !isMatchRoute;

    if (shouldCleanup) {
      console.log(
        "Should perform cleanup - current path:",
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
          console.log("Page hidden - performing cleanup");

          // Thử SignalR trước
          if (this.connection && this.connection.state === "Connected") {
            try {
              // Không await vì page đang hidden
              this.connection.invoke(
                "OutRoom",
                roomData.roomId,
                roomData.userId
              );
            } catch (error) {
              console.error(
                "SignalR cleanup on visibility change failed:",
                error
              );
            }
          }

          this.clearRoomData();
        }
      }
    });

    // Handle beforeunload as backup
    window.addEventListener("beforeunload", () => {
      const roomData = this.getRoomData();
      if (roomData && this.shouldPerformCleanup()) {
        console.log("Before unload - performing cleanup");

        // Thử SignalR trước (synchronous)
        if (this.connection && this.connection.state === "Connected") {
          try {
            // Không await vì beforeunload cần nhanh
            this.connection.invoke("OutRoom", roomData.roomId, roomData.userId);
          } catch (error) {
            console.error("SignalR cleanup on beforeunload failed:", error);
          }
        }

        // Backup với sendBeacon
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/out-room",
            JSON.stringify({
              roomId: roomData.roomId,
              userId: roomData.userId,
            })
          );
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
            console.log("Popstate - performing cleanup");
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
