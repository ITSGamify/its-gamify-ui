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
import { RoomCleanupManager } from "@utils/roomCleanup";

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
  const isExiting = useRef(false);
  const unloadingRef = useRef(false);

  // Setup connection cho cleanup manager
  useEffect(() => {
    if (connection) {
      RoomCleanupManager.setConnection(connection);
    }
  }, [connection]);

  // Join room effect
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

        // Set room data for cleanup sau khi join thành công
        RoomCleanupManager.setRoomData(roomId, profile.user.id, "Waiting");
      } catch {
        setErrorMessage("Lỗi khi tham gia phòng.");
        intial_join.current = false;
        navigate(
          getRoute(PATH.TOURNAMENT_ROOM, {
            tournamentId: roomDetail?.challenge_id,
          })
        );
      }
    };

    joinRoom();
  }, [connection, navigate, profile, roomDetail, roomId, setErrorMessage]);

  // Countdown và navigate to match
  const countdownTimerRef = useRef<number | null>(null);

  // Helper function để clear countdown
  const clearCountdownTimer = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  // Helper function để reset countdown
  const resetCountdown = useCallback(() => {
    clearCountdownTimer();
    setCountdown(5);
  }, [clearCountdownTimer]);

  // Countdown effect
  useEffect(() => {
    const shouldStartCountdown =
      roomDetail &&
      roomDetail.status === "PLAYING" &&
      roomDetail.host_user_id !== null &&
      roomDetail.room_users?.some((ru) => ru.user_id === profile?.user.id);

    if (shouldStartCountdown) {
      // Clear existing timer trước khi tạo mới
      clearCountdownTimer();

      countdownTimerRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearCountdownTimer();

            RoomCleanupManager.clearRoomData();

            setTimeout(() => {
              navigate(`/match?roomId=${roomId}`);
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Reset countdown khi điều kiện không thỏa mãn
      resetCountdown();
    }

    // Cleanup khi component unmount hoặc dependencies change
    return () => {
      clearCountdownTimer();
    };
  }, [
    navigate,
    roomDetail,
    roomId,
    profile?.user.id,
    clearCountdownTimer,
    resetCountdown,
  ]);

  // Effect riêng để handle room state changes
  useEffect(() => {
    if (roomDetail) {
      // Nếu host thoát hoặc room status thay đổi về WAITING
      if (roomDetail.host_user_id === null || roomDetail.status === "WAITING") {
        resetCountdown();
        setIsStarting(false);
      }
    }
  }, [roomDetail, resetCountdown]);

  const handleStart = async () => {
    if (!connection || !roomId) {
      return;
    }

    try {
      setIsStarting(true);
      await connection
        .invoke("StartMatch", roomId)
        .then(() => setIsStarting(false));
    } catch (error) {
      console.error("Start match failed:", error);
      setErrorMessage("Lỗi khi bắt đầu trận đấu.");
      setIsStarting(false);
    }
  };

  // Handle out room - giữ nguyên logic cũ
  const handleOutRoom = useCallback(async () => {
    if (!connection) return;

    isExiting.current = true;

    try {
      await connection.invoke("OutRoom", roomId, profile?.user.id);

      // Clear cleanup data khi out room thành công
      console.log("Out room successful, clearing cleanup data");
      RoomCleanupManager.clearRoomData();

      intial_join.current = true;
      const route = getRoute(PATH.TOURNAMENT_ROOM, {
        tournamentId: roomDetail?.challenge_id,
      });
      navigate(route);
    } catch (error) {
      console.error("Out room failed:", error);
      setErrorMessage("Lỗi khi rời phòng.");
      isExiting.current = false;
    }
  }, [
    connection,
    navigate,
    profile?.user.id,
    roomDetail?.challenge_id,
    roomId,
    setErrorMessage,
  ]);

  // Cleanup function - có thể giữ lại để sử dụng trong các trường hợp đặc biệt
  const cleanup = useCallback(() => {
    if (unloadingRef.current) return;

    unloadingRef.current = true;
    console.log("Manual cleanup - leaving room");

    if (connection && roomId && profile?.user?.id) {
      connection
        .invoke("OutRoom", roomId, profile.user.id)
        .then(() => {
          intial_join.current = true;
          console.log("Manual cleanup successful");
        })
        .catch((err) => console.error("Manual cleanup error:", err));
    }
  }, [connection, roomId, profile?.user?.id]);

  // SignalR room updated handler
  useEffect(() => {
    if (!connection) return;

    const handleRoomUpdated = (message: string) => {
      if (isExiting.current) return;

      try {
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
          // Nếu không còn trong room (bị out), clear cleanup và redirect
          console.log(
            "User no longer in room, clearing cleanup data and redirecting"
          );
          RoomCleanupManager.clearRoomData();
          navigate(
            getRoute(PATH.TOURNAMENT_ROOM, {
              tournamentId: roomData.challenge_id,
            })
          );
        }
      } catch (error) {
        console.error("Error parsing room update:", error);
      }
    };

    connection.on("RoomUpdated", handleRoomUpdated);

    return () => {
      connection.off("RoomUpdated", handleRoomUpdated);
    };
  }, [connection, profile?.user.id, navigate]);

  // Get challenge questions
  const getChallengeQuestionsReq = {
    page: 0,
    limit: 10000,
    courseId: roomDetail?.challenge?.course_id || "",
    q: "",
  };

  const { data: questionsData, isFetching: isLoadingQuestion } =
    useGetChallengeQuestions(getChallengeQuestionsReq);

  const num_of_question = questionsData?.pagination.total_items_count || 0;

  useEffect(() => {
    return () => {
      console.log("useWaitingRoomPage unmounting");
    };
  }, []);

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
    forceCleanup: cleanup,
  };
};
