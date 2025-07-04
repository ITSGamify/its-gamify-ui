// src/App.tsx
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastProvider } from "@providers/ToastProvider";
import { QueryProvider } from "@providers/QueryProvider";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "@styles/global.css";
import { useGlobal } from "@hooks/shared/useGlobal";

const App: React.FC = () => {
  const { themeOptions } = useGlobal();
  const theme = createTheme(themeOptions);

  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
