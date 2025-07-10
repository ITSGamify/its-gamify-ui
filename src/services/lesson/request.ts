import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";
import { Lesson } from "@interfaces/api/lesson";

export const getLessonDetail = async (lessonId: string): Promise<Lesson> => {
  return request({
    url: getRoute(END_POINTS.LESSONS.DETAIL, { lessonId }),
    method: HTTP_METHODS.GET,
  });
};
