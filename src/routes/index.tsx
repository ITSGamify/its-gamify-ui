import { PATH } from "@constants/path";
import { USER_ROLES } from "@constants/user-role";
import { RoleEnum } from "@interfaces/shared/user";
import userSession from "@utils/user-session";

import LoginPage from "@pages/Login";
import HomePage from "@pages/Home";
import CoursePage from "@pages/Course";
import CourseOverviewPage from "@pages/Course/Overview";
import QuizPage from "@pages/Quiz";
import ChallengePage from "@pages/Challenge";
import NotFound404 from "@pages/NotFound404";
import ServerError500 from "@pages/ServerError500";
import Forbidden403 from "@pages/Forbidden403";
import MainLayout from "@components/layout/MainLayout";

import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import { JSX } from "react";

const ErrorFallback = () => <ServerError500 />;

type ProtectedRouteProps = {
  children: JSX.Element;
  fallbackUrl?: string;
  allowedRoles?: string[];
};

const getRoutes = (routes: RouteObject[]) => {
  return routes.map((route) => ({
    ...route,
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {route.element}
      </ErrorBoundary>
    ),
  }));
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = PATH.LOGIN,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const isAuthenticated = userSession.isAuthenticated();
  const userProfile = userSession.getUserProfile();
  const isNotAllowedRole =
    userProfile &&
    allowedRoles?.length > 0 &&
    !allowedRoles.includes(userProfile?.role);
  if (!isAuthenticated) {
    return <Navigate to={fallbackUrl} />;
  }

  if (isNotAllowedRole) {
    return <Navigate to="/403" />;
  }

  return children;
};

const router = createBrowserRouter(
  getRoutes([
    {
      path: PATH.NOT_FOUND,
      element: <NotFound404 />,
    },
    {
      path: PATH.FORBIDDEN,
      element: <Forbidden403 />,
    },
    {
      path: PATH.INTERNAL_SERVER_ERROR,
      element: <ServerError500 />,
    },
    {
      path: PATH.LOGIN,
      element: <LoginPage />,
    },
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          path: PATH.HOME,
          element: <HomePage />,
        },
        {
          path: PATH.COURSES,
          element: <CoursePage />,
        },
        {
          path: PATH.COURSES_OVERVIEWS,
          element: <CourseOverviewPage />,
        },
        {
          path: PATH.COURSES_OVERVIEWS,
          element: <CoursePage />,
        },
        {
          path: PATH.QUIZ,
          element: <QuizPage />,
        },
        {
          path: PATH.CHALLENGE,
          element: <ChallengePage />,
        },
      ],
    },
  ])
);

export default router;
