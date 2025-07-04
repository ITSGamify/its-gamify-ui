import { BASE_KEYS } from "@constants/endpoint";

export const QUERY_KEYS = {
  ROLE: BASE_KEYS.ROLES,
  DEPARTMENT: {
    BASE: BASE_KEYS.DEPARTMENTS,
  },
  ACCOUNT: {
    BASE: BASE_KEYS.ACCOUNTS,
  },
  COURSE: {
    BASE: BASE_KEYS.COURSES,
    DETAIL: `${BASE_KEYS.COURSES}/:courseId`,
    COURSE_PARTICIPATIONS: `${BASE_KEYS.COURSES}/:courseId/course-participations`,
  },
  PARTICIPATIONS: {
    BASE: BASE_KEYS.COURSE_PARTICIPATIONS,
  },
};

export const DEFAULT_LIMIT_OPTIONS_PARAMS = 50;
