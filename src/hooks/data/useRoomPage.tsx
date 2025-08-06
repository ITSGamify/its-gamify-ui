import { PATH } from "@constants/path";
import { useGetChallengeDetail, useGetRooms } from "@services/challenge";
import { useGetUserMetric } from "@services/user";
import { getRoute } from "@utils/route";
import userSession from "@utils/user-session";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  return {
    rooms: roomRes?.data || [],
    challengeDetail,
    isLoading: isLoadingChallenge || isLoadingUserMetric || isLoadingRooms,
    handleCloseRoom,
    showCreateRoom,
    handleOpenRoom,
    userMetric,
    handleBackToPrevious,
    handleJoinRoom,
    tournamentId,
  };
};
