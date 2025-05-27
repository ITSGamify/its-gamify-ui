// src/pages/Login/index.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useCustomTranslation from "@hooks/shared/useTranslation";
import LoginButton from "@components/ui/atoms/LoginButton";
import LoginInput from "@components/ui/atoms/LoginInput";
import { useAuth } from "@hooks/shared/useAuth";
import logoImage from "@assets/images/its-gamify-logo.png";
import bannerImage from "@assets/images/its_gamify_banner.png";
// import bannerImage from "@assets/images/its-gamify-login-banner.png";
import { TRANSLATION_NAME_SPACES } from "@i18n/config";
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { t } = useCustomTranslation(TRANSLATION_NAME_SPACES.LOGIN);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation cơ bản
    if (!formData.email) {
      setError(t("validation.emailRequired"));
      return;
    }

    if (!formData.password) {
      setError(t("validation.passwordRequired"));
      return;
    }

    try {
      setIsLoading(true);
      // Giả định có hàm login từ useAuth hook
      await login(formData.email, formData.password, formData.rememberMe);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError(t("error.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        width: "100%", // Thêm width: 100%
        margin: 0, // Đảm bảo không có margin
        padding: 0, // Đảm bảo không có padding
        overflow: "hidden", // Ngăn scroll nếu có overflow
        bgcolor: "#f5f7ff",
      }}
    >
      {/* Phần bên trái - hình ảnh/banner */}
      <Box
        sx={{
          borderRadius: "0 10px 10px 0",
          flex: { xs: 1, md: 0.5 },
          display: { xs: "none", md: "flex" },
          position: "relative",
          backgroundImage: `url(${bannerImage})`,
          // backgroundImage:
          // "url(https://source.unsplash.com/random/1200x900?education)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Lớp overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // bgcolor: "rgba(67, 97, 238, 0.85)",
            zIndex: 1,
          }}
        />

        {/* Nội dung văn bản - đặt ở giữa và trên lớp overlay */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Box sx={{ maxWidth: 500, textAlign: "center", cursor: "pointer" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 3, fontWeight: 700, color: "#ffffff" }}
            >
              {t("welcomeBack")}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "#f5f5f5" }}>
              {t("description")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Phần bên phải - form đăng nhập */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              width: "100%",
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <img src={logoImage} alt="Its-Gamify Logo" height={60} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{ mt: 2, fontWeight: 600 }}
              >
                {t("title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("subtitle")}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <LoginInput
                label={t("form.email")}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("form.emailPlaceholder")}
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <LoginInput
                label={t("form.password")}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={t("form.passwordPlaceholder")}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {t("form.rememberMe")}
                    </Typography>
                  }
                />
                <Link href="/forgot-password" variant="body2" underline="hover">
                  {t("form.forgotPassword")}
                </Link>
              </Box>

              <LoginButton
                type="submit"
                variant="primary"
                disabled={isLoading}
                sx={{ mt: 2, mb: 3 }}
              >
                {isLoading ? t("form.loading") : t("form.loginButton")}
              </LoginButton>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
