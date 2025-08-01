import { Room } from "@interfaces/api/challenge";
import { RequestUpdateRoomParams, RoomRequestParams } from ".";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";

export const createRoom = async (payload: RoomRequestParams): Promise<Room> => {
  return request({
    url: getRoute(END_POINTS.ROOM.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const updateRoom = async (
  payload: RequestUpdateRoomParams
): Promise<void> => {
  const { id: roomId, ...data } = payload;
  return request({
    url: getRoute(END_POINTS.ROOM.DETAIL, { roomId }),
    method: HTTP_METHODS.PUT,
    data,
  });
};

export const getRoomDetail = async (roomId: string): Promise<Room> => {
  return request({
    url: getRoute(END_POINTS.ROOM.DETAIL, { roomId }),
    method: HTTP_METHODS.GET,
  });
};
