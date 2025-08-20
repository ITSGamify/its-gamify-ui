import { useMutation, useQuery } from "@tanstack/react-query";
import { createRoom, updateRoom, getRoomDetail, joinRoom } from "./request";
import { QUERY_KEYS } from "@constants/query";

export interface RoomRequestParams {
  question_count: number;
  time_per_question: number;
  bet_points: number;
  challenge_id: string;
  host_user_id: string;
  max_players: number;
}

export interface RequestUpdateRoomParams extends RoomRequestParams {
  id: string;
  // opponent_user_id: string | null;
  // is_host_ready: boolean;
  // is_opponent_ready: boolean;
  // is_abandoned: boolean;
}
export interface RequestJoinRoomParams {
  id: string;
  room_code: string;
}

export const useCreateRoom = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: RoomRequestParams) => createRoom(payload),
    onSuccess,
  });
};

export const useGetRoomDetail = (roomId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROOM.DETAIL, roomId],
    queryFn: () => getRoomDetail(roomId),
    enabled: !!roomId,
  });
};

export const useUpdateRoom = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: RequestUpdateRoomParams) => updateRoom(payload),
    onSuccess,
  });
};

export const useJoinRoom = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: RequestJoinRoomParams) => joinRoom(payload),
    onSuccess,
  });
};
