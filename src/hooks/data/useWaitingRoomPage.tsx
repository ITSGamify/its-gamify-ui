import { PATH } from "@constants/path";
import { Room } from "@interfaces/api/challenge";
import { useSignalR } from "@providers/SignalRContext";
import { useGetRoomDetail } from "@services/room";
import { useGetUserMetric } from "@services/user";
import { getRoute } from "@utils/route";
import userSession from "@utils/user-session";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useWaitingRoomPage = () => {
  const profile = userSession.getUserProfile();
  const navigate = useNavigate();

  const { roomId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const { data: roomDetailFromApi, isFetching: isLoadingRoom } =
    useGetRoomDetail(roomId || "");
  const [parsedRoom, setParsedRoom] = useState<Room | null>(null);
  const [countdown, setCountdown] = useState(5);

  const { data: userMetric, isFetching: isLoadingUserMetric } =
    useGetUserMetric(profile?.user.id || "");
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const { connection, setErrorMessage } = useSignalR();

  connection?.on("RoomUpdated", (message: string) => {
    const roomData = JSON.parse(message);
    setParsedRoom(roomData);
  });

  useEffect(() => {
    const joinRoom = async () => {
      if (!connection || !profile?.user.id || !roomId) {
        setErrorMessage("Không thể kết nối hoặc thiếu userId.");
        return;
      }

      try {
        await connection.invoke("JoinRoom", roomId, profile.user.id);
      } catch {
        setErrorMessage("Lỗi khi tham gia phòng.");
      }
    };

    joinRoom();
  }, [connection, profile, roomId, setErrorMessage]);

  // Ưu tiên sử dụng parsedRoom nếu có, ngược lại sử dụng roomDetailFromApi
  const roomDetail = parsedRoom || roomDetailFromApi;

  useEffect(() => {
    if (
      roomDetail &&
      roomDetail.is_host_ready &&
      roomDetail.is_opponent_ready
    ) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => {
              navigate(`/match?roomId=${roomId}`);
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [navigate, roomDetail, roomId]);

  const handleReady = async (userId: string) => {
    if (!connection || !userId || !roomId) {
      setErrorMessage("Không thể kết nối hoặc thiếu userId.");
      return;
    }

    try {
      await connection.invoke("ReadyToJoin", roomId, userId);
    } catch {
      setErrorMessage("Lỗi khi sẵn sàng.");
    }
  };
  const handleOutRoom = useCallback(async () => {
    if (!connection) return;
    await connection.invoke("OutRoom", roomId, profile?.user.id);
    const route = getRoute(PATH.TOURNAMENT_ROOM, {
      tournamentId: roomDetail?.challenge_id,
    });

    navigate(route);
  }, [
    connection,
    navigate,
    profile?.user.id,
    roomDetail?.challenge_id,
    roomId,
  ]);

  return {
    isLoading: isLoadingUserMetric || isLoadingRoom,
    userMetric,
    roomDetail,
    openModal,
    handleOpenModal,
    handleCloseModal,
    countdown,
    handleReady,
    isHost: roomDetail?.host_user_id == profile?.user.id,
    handleOutRoom,
  };
};
