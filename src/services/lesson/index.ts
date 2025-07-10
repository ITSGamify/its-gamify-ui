import { QUERY_KEYS } from "@constants/query";
import { useQuery } from "@tanstack/react-query";
import { getLessonDetail } from "./request";

export const useGetLesson = (lessonId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LESSONS, lessonId],
    queryFn: () => getLessonDetail(lessonId),
    enabled: !!lessonId,
  });
};
