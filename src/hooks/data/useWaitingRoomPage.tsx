import { PATH } from "@constants/path";
import { Room, RoomUser } from "@interfaces/api/challenge";
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
  const roomDetail = parsedRoom || roomDetailFromApi;
  const [isStarting, setIsStarting] = useState(false);
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
        setErrorMessage("Không thể kết nối.");
        return;
      }
      intial_join.current = true;

      try {
        await connection.invoke("JoinRoom", roomId, profile.user.id);
      } catch {
        setErrorMessage("Lỗi khi tham gia phòng.");
      }
    };

    joinRoom();
  }, [connection, profile, roomId, setErrorMessage]);

  useEffect(() => {
    if (roomDetail && roomDetail.status === "PLAYING") {
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

  const handleStart = async () => {
    if (!connection || !roomId) {
      setErrorMessage("Không thể kết nối.");
      return;
    }

    try {
      setIsStarting(true);
      await connection
        .invoke("StartMatch", roomId)
        .then(() => setIsStarting(false)); // Giả sử có method StartRoom trong SignalR
    } catch {
      setErrorMessage("Lỗi khi bắt đầu trận đấu.");
    }
  };

  const isExiting = useRef(false);

  // Trong handleOutRoom
  const handleOutRoom = useCallback(async () => {
    if (!connection) return;
    isExiting.current = true; // Đánh dấu đang exit
    await connection.invoke("OutRoom", roomId, profile?.user.id).then(() => {
      intial_join.current = true;
      const route = getRoute(PATH.TOURNAMENT_ROOM, {
        tournamentId: roomDetail?.challenge_id,
      });
      navigate(route);
    });
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

    if (roomData.host_user_id === null || roomData.status === "WAITING") {
      setCountdown(5);
    }

    // Kiểm tra user hiện tại có trong room không
    const isInRoom = roomData.room_users?.some(
      (ru: RoomUser) => ru.user_id === profile?.user.id
    );
    if (isInRoom) {
      setParsedRoom(roomData);
    } else {
      // Nếu không còn trong room (bị out), redirect
      navigate(
        getRoute(PATH.TOURNAMENT_ROOM, { tournamentId: roomData.challenge_id })
      );
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

  const num_of_question = questionsData?.pagination.total_items_count || 0;

  const unloadingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (unloadingRef.current) return; // Tránh gọi nhiều lần

    unloadingRef.current = true;
    console.log("Cleaning up - leaving room"); // Thêm log để debug

    if (connection && roomId && profile?.user?.id) {
      connection
        .invoke("OutRoom", roomId, profile.user.id)
        .then(() => {
          intial_join.current = true;
        })
        .catch((err) => console.error("Error out room:", err));
    }
  }, [connection, roomId, profile?.user?.id]);

  useEffect(() => {
    return () => {
      if (!window.location.href.includes("/match")) {
        cleanup();
      }
    };
  }, [cleanup]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Thêm sự kiện unload để đảm bảo cleanup được gọi
    window.addEventListener("unload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnload);
    };
  }, [cleanup]);

  useEffect(() => {
    // Sử dụng History API để phát hiện khi người dùng bấm nút back
    const handlePopState = () => {
      console.log("Pop state event triggered"); // Thêm log để debug
      cleanup();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [cleanup]);

  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);

      // Kiểm tra xem URL mới có phải là route đến match không
      const newUrl = window.location.href;
      const matchRoute = getRoute(PATH.TOURNAMENT_MATCH) + "?roomId=" + roomId;

      if (!newUrl.includes(matchRoute)) {
        console.log("Push state navigation detected"); // Thêm log để debug
        cleanup();
      }

      return result;
    };

    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);

      // Kiểm tra tương tự như pushState
      const newUrl = window.location.href;
      const matchRoute = getRoute(PATH.TOURNAMENT_MATCH) + "?roomId=" + roomId;

      if (!newUrl.includes(matchRoute)) {
        console.log("Replace state navigation detected"); // Thêm log để debug
        cleanup();
      }

      return result;
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [cleanup, roomId]);

  return {
    isLoading: isLoadingUserMetric || isLoadingRoom || isLoadingQuestion,
    userMetric,
    roomDetail,
    openModal,
    handleOpenModal,
    handleCloseModal,
    countdown,
    handleStart,
    isHost: roomDetail?.host_user_id == profile?.user.id,
    handleOutRoom,
    num_of_question,
    isStarting,
  };
};
