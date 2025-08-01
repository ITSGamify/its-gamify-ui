import { PATH } from "@constants/path";
import { useSignalR } from "@providers/SignalRContext";
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

  const { connection, setErrorMessage } = useSignalR();

  const handleJoinRoom = async (roomId: string) => {
    if (!connection || !profile?.user.id) {
      setErrorMessage("Không thể kết nối hoặc thiếu userId.");
      return;
    }

    try {
      await connection.invoke("JoinRoom", roomId, profile?.user.id);
      const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, { roomId: roomId });
      navigate(route);
    } catch (err) {
      console.error("Error joining room: ", err);
      setErrorMessage("Lỗi khi tham gia phòng.");
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
