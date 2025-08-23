import { request } from "@config/axios";
import { RequestAccountsParams } from ".";

import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";

export const updateAccount = async (
  payload: RequestAccountsParams & { id: string }
): Promise<void> => {
  const { id: accountId, ...data } = payload;
  return request({
    url: getRoute(END_POINTS.ACCOUNTS.DETAIL, { userId: accountId }),
    method: HTTP_METHODS.PUT,
    data,
  });
};
