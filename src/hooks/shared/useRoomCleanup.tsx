import { useSignalR } from "@providers/SignalRContext";
import { RoomCleanupManager, RoomType } from "@utils/roomCleanup";
import { useCallback, useEffect } from "react";

export const useRoomCleanup = () => {
  const { connection } = useSignalR();

  useEffect(() => {
    RoomCleanupManager.setConnection(connection);
  }, [connection]);

  const setRoomForCleanup = useCallback(
    (roomId: string, userId: string, type: RoomType) => {
      RoomCleanupManager.setRoomData(roomId, userId, type);
    },
    []
  );

  const clearRoomCleanup = useCallback(() => {
    RoomCleanupManager.clearRoomData();
  }, []);

  const forceCleanup = useCallback(async () => {
    await RoomCleanupManager.forceCleanup();
  }, []);

  return {
    setRoomForCleanup,
    clearRoomCleanup,
    forceCleanup,
  };
};
