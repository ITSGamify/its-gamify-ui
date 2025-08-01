import { useGetRoomDetail } from "@services/room";
import { useGetUserMetric } from "@services/user";
import userSession from "@utils/user-session";
import { useParams } from "react-router-dom";

export const useWaitingRoomPage = () => {
  const profile = userSession.getUserProfile();
  const { roomId } = useParams();

  const { data: roomDetail, isFetching: isLoadingRoom } = useGetRoomDetail(
    roomId || ""
  );

  const { data: userMetric, isFetching: isLoadingUserMetric } =
    useGetUserMetric(profile?.user.id || "");

  return {
    isLoading: isLoadingUserMetric || isLoadingRoom,
    userMetric,
    roomDetail,
  };
};
