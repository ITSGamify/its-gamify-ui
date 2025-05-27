import { useState, useEffect, createContext } from "react";
// import authService from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập (từ localStorage hoặc sessionStorage)
    const checkAuth = async () => {
      try {
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token");
        if (token) {
          const userData = {
            id: 1,
            name: "Nguyen Van A",
            email: "nguyenvana@gmail.com",
            role: "admin",
          };
          // Gọi API để lấy thông tin người dùng dựa trên token
          // const userData = await authService.getCurrentUser(token);
          setUser(userData);
        }
      } catch (error) {
        console.log("Debug_________________________AuthProviderError:", error);
        // Token không hợp lệ hoặc hết hạn
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      //   const { token, user } = await authService.login(email, password);
      const token = "aaaaaaaaaaaaaaaaaa";
      const user = {
        id: 1,
        name: "Nguyen Van A",
        email: "nguyenvana@gmail.com",
        role: "admin",
      };
      // Gọi API để đăng nhập và lấy token
      // Lưu token vào storage phù hợp
      if (rememberMe) {
        localStorage.setItem("auth_token", token);
      } else {
        sessionStorage.setItem("auth_token", token);
      }

      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      //   await authService.logout();
    } finally {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
