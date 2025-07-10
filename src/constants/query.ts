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
    COURSE_SECTIONS: `${BASE_KEYS.COURSES}/:courseId/course-sections`,
  },
  PARTICIPATIONS: {
    BASE: BASE_KEYS.COURSE_PARTICIPATIONS,
  },
  LESSONS: {
    BASE: BASE_KEYS.LESSONS,
  },
};

export const DEFAULT_LIMIT_OPTIONS_PARAMS = 50;
