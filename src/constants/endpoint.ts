export const BASE_KEYS = {
  DEPARTMENTS: "departments",
  ACCOUNTS: "users",
  COURSES: "courses",
  ROLES: "roles",
  STORAGE_FILES: "files",
  COURSE_PARTICIPATIONS: "course-participations",
  COURSE_RESULTS: "course-results",
  LESSONS: "lessons",
  PROGRESS: "learning-progresses",
  QUIZZES: "quizzes",
  QUIZ_RESULTS: "quiz-results",
  CATEGORIES: "categories",
};

export const END_POINTS = {
  LOGIN: "/auth",
  LOGOUT: "/auth/logout",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHECK_AUTH_STATUS: "/auth/check-auth-status",
  GET_USER_INFO: "/user/info",
  UPDATE_USER_INFO: "/user/update",
  CHANGE_PASSWORD: "/user/change-password",
  UPLOAD_AVATAR: "/user/upload-avatar",
  COURSE: {
    BASE: BASE_KEYS.COURSES,
    DETAIL: `${BASE_KEYS.COURSES}/:courseId`,
    DELETE_RANGE: `${BASE_KEYS.COURSES}/delete`,
    COURSE_PARTICIPATIONS: `${BASE_KEYS.COURSES}/:courseId/course-participations`,
    COURSE_SECTIONS: `${BASE_KEYS.COURSES}/:courseId/course-sections`,
  },
  PARTICIPATIONS: {
    BASE: BASE_KEYS.COURSE_PARTICIPATIONS,
  },
  LESSONS: {
    BASE: BASE_KEYS.LESSONS,
    DETAIL: `${BASE_KEYS.LESSONS}/:lessonId`,
  },
  PROGRESS: {
    BASE: BASE_KEYS.PROGRESS,
  },
  QUIZZES: {
    BASE: BASE_KEYS.QUIZZES,
    DETAIL: `${BASE_KEYS.QUIZZES}/:quizId`,
  },
  QUIZ_RESULTS: {
    BASE: BASE_KEYS.QUIZ_RESULTS,
    DETAIL: `${BASE_KEYS.QUIZ_RESULTS}/:quizId`,
  },
  CATEGORIES: {
    BASE: BASE_KEYS.CATEGORIES,
  },
  ACCOUNTS: {
    COURSE_RESULT: `${BASE_KEYS.ACCOUNTS}/:userId/course-results`,
  },
  COURSE_RESULT: {
    DETAIL: `${BASE_KEYS.COURSE_RESULTS}/:resultId`,
  },
};
