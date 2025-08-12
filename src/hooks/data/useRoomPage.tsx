import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import { useGetChallengeDetail, useGetRooms } from "@services/challenge";
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

  const { data: challengeDetail, isFetching: isLoadingChallenge } =
    useGetChallengeDetail(tournamentId || "");

  const { data: userMetric, isFetching: isLoadingUserMetric } =
    useGetUserMetric(profile?.user.id || "");

  const { data: roomRes, isFetching: isLoadingRooms } = useGetRooms(
    tournamentId || ""
  );
  const handleCloseRoom = () => {
    setShowCreateRoom(false);
  };

  const handleOpenRoom = () => {
    setShowCreateRoom(true);
  };

  const handleBackToPrevious = () => {
    navigate(PATH.TOURNAMENT);
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, { roomId: roomId });
      navigate(route);
    } catch (err) {
      console.error("Error joining room: ", err);
    }
  };

  useEffect(() => {
    if (challengeDetail && challengeDetail?.course.course_results.length == 0) {
      toast.warning(ToastContent, {
        data: { message: "Bạn chưa hoàn thành khóa học" },
      });
      const route = getRoute(PATH.TOURNAMENT);
      navigate(route);
    }
  }, [
    challengeDetail,
    challengeDetail?.course.course_results.length,
    navigate,
  ]);

  const getChallengeQuestionsReq = {
    page: 0,
    limit: 10000,
    courseId: challengeDetail?.course_id || "",
    q: "",
  };

  const { data: questionsData, isFetching: isLoadingQuestion } =
    useGetChallengeQuestions(getChallengeQuestionsReq);

  const num_of_question = questionsData?.length;

  return {
    rooms: roomRes?.data || [],
    challengeDetail,
    isLoading:
      isLoadingChallenge ||
      isLoadingUserMetric ||
      isLoadingRooms ||
      isLoadingQuestion,
    handleCloseRoom,
    showCreateRoom,
    handleOpenRoom,
    userMetric,
    handleBackToPrevious,
    handleJoinRoom,
    tournamentId,
    num_of_question,
  };
};
