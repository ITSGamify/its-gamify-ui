import { PATH } from "@constants/path";
import { Room } from "@interfaces/api/challenge";
import { useSignalR } from "@providers/SignalRContext";
import { useGetChallengeQuestions } from "@services/question";
import { useGetRoomDetail } from "@services/room";
import { useGetUserMetric } from "@services/user";
import { getRoute } from "@utils/route";
import userSession from "@utils/user-session";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const intial_join = useRef(false);

  useEffect(() => {
    if (intial_join.current) return;
    const joinRoom = async () => {
      if (!connection || !profile?.user.id || !roomId) {
        setErrorMessage("Không thể kết nối hoặc thiếu userId.");
        return;
      }

      try {
        await connection.invoke("JoinRoom", roomId, profile.user.id);
        intial_join.current = true;
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
  const isExiting = useRef(false);

  // Trong handleOutRoom
  const handleOutRoom = useCallback(async () => {
    if (!connection) return;
    isExiting.current = true; // Đánh dấu đang exit
    await connection.invoke("OutRoom", roomId, profile?.user.id).then(() => {
      intial_join.current = true;
    });
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

  connection?.on("RoomUpdated", (message: string) => {
    if (isExiting.current) return;
    const roomData = JSON.parse(message) as Room;

    if (roomData.host_user_id === null || roomData.opponent_user_id === null) {
      setCountdown(5);
    }

    if (
      roomData.host_user_id === profile?.user.id ||
      roomData.opponent_user_id === profile?.user.id
    ) {
      setParsedRoom(roomData);
    }
  });

  const getChallengeQuestionsReq = {
    page: 0,
    limit: 10000,
    courseId: roomDetail?.challenge?.course_id || "",
    q: "",
  };

  const { data: questionsData, isFetching: isLoadingQuestion } =
    useGetChallengeQuestions(getChallengeQuestionsReq);

  const num_of_question = questionsData?.length;

  const opp_id =
    roomDetail?.host_user_id === profile?.user.id
      ? roomDetail?.opponent_user_id
      : roomDetail?.host_user_id;
  const { data: opponentMetric, isFetching: isLoadingOpponentMetric } =
    useGetUserMetric(opp_id || "");

  useEffect(() => {
    let currentUrl = window.location.href;

    const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, {
      roomId: roomId,
    });
    const cleanup = () => {
      connection
        ?.invoke("OutRoom", roomId, profile?.user.id)
        .then(() => {
          intial_join.current = true;
        })
        .catch((err) => console.error("Error out room:", err));
    };

    const handleBeforeUnload = () => {
      cleanup();
    };

    const handleUrlChange = () => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;

        // Kiểm tra xem URL mới có phải là route đến waiting room không
        const newUrl = window.location.href;
        const waitingRoomUrl = new URL(route, window.location.origin).href;

        // Chỉ gọi cleanup nếu URL mới không phải là route đến waiting room
        if (newUrl !== waitingRoomUrl && !newUrl.includes(route)) {
          cleanup();
        }
      }
    };

    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      handleUrlChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      handleUrlChange();
    };

    // Event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleUrlChange);

    return () => {
      // Restore original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      // Remove listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [
    connection,
    profile?.user.id,
    roomDetail,
    roomDetail?.id,
    roomDetail?.status,
    roomId,
  ]);
  return {
    isLoading:
      isLoadingUserMetric ||
      isLoadingRoom ||
      isLoadingQuestion ||
      isLoadingOpponentMetric,
    userMetric,
    roomDetail,
    openModal,
    handleOpenModal,
    handleCloseModal,
    countdown,
    handleReady,
    isHost: roomDetail?.host_user_id == profile?.user.id,
    handleOutRoom,
    num_of_question,
    opponentMetric,
  };
};
