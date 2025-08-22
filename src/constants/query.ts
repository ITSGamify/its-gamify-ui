import { BASE_KEYS } from "@constants/endpoint";

export const QUERY_KEYS = {
  ROLE: BASE_KEYS.ROLES,
  DEPARTMENT: {
    BASE: BASE_KEYS.DEPARTMENTS,
  },
  ACCOUNT: {
    BASE: BASE_KEYS.ACCOUNTS,
    DETAIL: `${BASE_KEYS.ACCOUNTS}/:userId`,
    STATISTIC: `${BASE_KEYS.ACCOUNTS}/:userId/statistic`,
    CHALLENGE_HISTORIES: `${BASE_KEYS.ACCOUNTS}/:userId/challenge-histories`,
  },
  COURSE: {
    BASE: BASE_KEYS.COURSES,
    DETAIL: `${BASE_KEYS.COURSES}/:courseId`,
    COURSE_PARTICIPATIONS: `${BASE_KEYS.COURSES}/:courseId/course-participations`,
    COURSE_SECTIONS: `${BASE_KEYS.COURSES}/:courseId/course-sections`,
    COURSE_COLLECTIONS: `${BASE_KEYS.COURSES}/:courseId/course-collections`,
    COURSE_REVIEWS: `${BASE_KEYS.COURSES}/:courseId/course-reviews`,
  },
  PARTICIPATIONS: {
    BASE: BASE_KEYS.COURSE_PARTICIPATIONS,
  },
  LESSONS: {
    BASE: BASE_KEYS.LESSONS,
  },
  QUIZZES: {
    BASE: `${BASE_KEYS.QUIZZES}`,
    DETAIL: `${BASE_KEYS.QUIZZES}/:quizId`,
  },
  CATEGORIES: {
    BASE: BASE_KEYS.CATEGORIES,
  },
  COURSE_RESULT: {
    DETAIL: `${BASE_KEYS.COURSE_RESULTS}/:resultId`,
  },
  PROGRESS: {
    BASE: BASE_KEYS.PROGRESS,
  },
  QUARTERS: {
    BASE: BASE_KEYS.QUARTERS,
  },
  METRICS: {
    BASE: BASE_KEYS.METRICS,
    GENERAL: BASE_KEYS.METRICS + "/general-infor",
    TOP10: BASE_KEYS.METRICS + "/top-10",
  },
  CHALLENGE: {
    BASE: BASE_KEYS.CHALLENGE,
    DETAIL: `${BASE_KEYS.CHALLENGE}/:challengeId`,
    ROOMS: `${BASE_KEYS.CHALLENGE}/:challengeId/rooms`,
  },
  ROOM: {
    BASE: BASE_KEYS.ROOM,
    DETAIL: `${BASE_KEYS.ROOM}/:roomId`,
  },
  QUESTION: {
    BASE: BASE_KEYS.QUESTION,
  },
};

export const DEFAULT_LIMIT_OPTIONS_PARAMS = 50;
