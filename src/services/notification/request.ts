import { PaginatedResponse } from "@interfaces/dom/query";
import {
  GetNotificationParams,
  NotificationRequestParam,
  RequestUpdateNotificationDetailParams,
  RequestUpdateNotificationParams,
} from ".";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { Notification } from "@interfaces/api/notification";

export const getNotifications = async (
  params?: GetNotificationParams
): Promise<PaginatedResponse<Notification>> => {
  return request({
    url: getRoute(END_POINTS.NOTIFICATION.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const updateNotification = async (
  payload: RequestUpdateNotificationParams
): Promise<Notification> => {
  const { notificationId: notificationId } = payload;
  return request({
    url: getRoute(END_POINTS.NOTIFICATION.DETAIL, { notificationId }),
    method: HTTP_METHODS.PUT,
    data: payload,
  });
};

export const updateAllNotification = async (
  payload: RequestUpdateNotificationDetailParams
): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.NOTIFICATION.BASE),
    method: HTTP_METHODS.PUT,
    data: payload,
  });
};

export const createNotification = async (
  payload: NotificationRequestParam
): Promise<Notification> => {
  return request({
    url: getRoute(END_POINTS.NOTIFICATION.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};
