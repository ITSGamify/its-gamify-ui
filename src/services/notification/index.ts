import { QUERY_KEYS } from "@constants/query";
import { PaginatedResponse, PaginationParams } from "@interfaces/dom/query";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  getNotifications,
  updateNotification,
  updateAllNotification,
  createNotification,
} from "./request";
import { Notification } from "@interfaces/api/notification";

export interface GetNotificationParams extends PaginationParams {
  title?: string;
  message?: string;
}

export interface RequestUpdateNotificationDetailParams {
  is_read: boolean;
}

export interface RequestUpdateNotificationParams {
  notificationId: string;
  is_read: boolean;
}

export interface NotificationRequestParam {
  type: string;
  user_id: string;
}

export const useGetNotifications = (params?: GetNotificationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION.BASE, params],
    queryFn: () => getNotifications(params),
    enabled: !!params,
  });
};

export const useCreateNotification = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: NotificationRequestParam) =>
      createNotification(payload),
    onSuccess,
  });
};

export const useUpdateNotification = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestUpdateNotificationParams) =>
      updateNotification(data),
    onSuccess,
  });
};

export const useUpdateAllNotification = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestUpdateNotificationDetailParams) =>
      updateAllNotification(data),
    onSuccess,
  });
};

export interface QueryParams {
  pageParam: number;
}

export const useInfiniteNotifications = (limit: number = 10) => {
  return useInfiniteQuery<
    PaginatedResponse<Notification>,
    Error,
    InfiniteData<PaginatedResponse<Notification>, number>,
    ["notifications"],
    number
  >({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 0 }) =>
      getNotifications({ page: pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination.page_index + 1 < pagination.total_pages) {
        return pagination.page_index + 1;
      }
      return undefined;
    },
  });
};
