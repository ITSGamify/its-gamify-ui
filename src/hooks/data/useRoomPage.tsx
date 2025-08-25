import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import { Room } from "@interfaces/api/challenge";
import { useGetChallengeDetail, useGetRooms } from "@services/challenge";
import { useGetCourseResultByCourseId } from "@services/course";
import { useGetChallengeQuestions } from "@services/question";
import { useGetUserMetric } from "@services/user";
import { getRoute } from "@utils/route";
import userSession from "@utils/user-session";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export interface RoomCreateForm {
  question_count: number;
  time_per_question: number;
  bet_points: number;
  challenge_id: string;
  host_user_id: string;
}

export const useRoomPage = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const profile = userSession.getUserProfile();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const handleCloseJoinModal = () => {
    setSelectedRoomId("");
    setShowJoinRoom(false);
  };

  const { data: challengeDetail, isFetching: isLoadingChallenge } =
    useGetChallengeDetail(tournamentId || "");

  const { data: userMetric, isFetching: isLoadingUserMetric } =
    useGetUserMetric(profile?.user.id || "");

  const { data: roomRes, isFetching: isLoadingRooms } = useGetRooms(
    tournamentId || ""
  );

  const { data: courseResult, isPending: isLoadingCoureResult } =
    useGetCourseResultByCourseId(challengeDetail?.course_id || "");

  const handleCloseRoom = () => {
    setShowCreateRoom(false);
  };

  const handleOpenRoom = () => {
    if (userMetric?.point_in_quarter && userMetric?.point_in_quarter < 50) {
      toast.error(ToastContent, {
        data: { message: "Bạn không đủ điểm cược!" },
      });
      return;
    }
    setShowCreateRoom(true);
  };

  const handleBackToPrevious = () => {
    navigate(PATH.TOURNAMENT);
  };

  const handleJoinRoom = async (room: Room) => {
    try {
      if (
        userMetric?.point_in_quarter &&
        room.bet_points > userMetric?.point_in_quarter
      ) {
        toast.warning(ToastContent, {
          data: { message: "Bạn không đủ điểm cược!" },
        });
        return;
      }

      if (room.room_users.length >= room.max_players) {
        toast.warning(ToastContent, {
          data: { message: "Phòng đã đầy!" },
        });
        return;
      }

      setSelectedRoomId(room.id);
      setShowJoinRoom(true);
    } catch (err) {
      console.error("Error joining room: ", err);
    }
  };

  useEffect(() => {
    if (!courseResult) {
      toast.warning(ToastContent, {
        data: { message: "Bạn chưa hoàn thành khóa học" },
      });
      const route = getRoute(PATH.TOURNAMENT);
      navigate(route);
    }
  }, [challengeDetail, courseResult, navigate]);

  const getChallengeQuestionsReq = {
    page: 0,
    limit: 10000,
    courseId: challengeDetail?.course_id || "",
    q: "",
  };

  const { data: questionsData, isFetching: isLoadingQuestion } =
    useGetChallengeQuestions(getChallengeQuestionsReq);

  const num_of_question = questionsData?.pagination.total_items_count || 0;

  return {
    rooms: roomRes?.data || [],
    challengeDetail,
    isLoading:
      isLoadingChallenge ||
      isLoadingUserMetric ||
      isLoadingRooms ||
      isLoadingQuestion ||
      isLoadingCoureResult,
    handleCloseRoom,
    showCreateRoom,
    handleOpenRoom,
    userMetric,
    handleBackToPrevious,
    tournamentId,
    num_of_question,
    showJoinRoom,
    selectedRoomId,
    handleCloseJoinModal,
    handleJoinRoom,
  };
};
