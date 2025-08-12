// src/pages/HomePage.tsx
import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  //   Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
  //   useMediaQuery,
  Avatar,
  Paper,
} from "@mui/material";
import {
  School as SchoolIcon,
  Devices as DevicesIcon,
  EmojiEvents as AchievementIcon,
  Timeline as ProgressIcon,
  People as TeamIcon,
  TrendingUp as GrowthIcon,
} from "@mui/icons-material";
import BenefitImage from "@assets/images/benefits-image.png";
import HeroImage from "@assets/images/hero-image.png";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(10, 0, 8),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(8, 0, 8),
    backgroundImage:
      "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
  },
}));

const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(10, 0),
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  height: "100%",
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  position: "relative",
}));

// Data for features
const features = [
  {
    title: "Khóa học đa dạng",
    description:
      "Hàng trăm khóa học được thiết kế riêng cho từng vị trí và kỹ năng cần thiết.",
    icon: <SchoolIcon fontSize="large" color="primary" />,
  },
  {
    title: "Học mọi lúc mọi nơi",
    description: "Truy cập hệ thống từ mọi thiết bị: máy tính hoặc tablet.",
    icon: <DevicesIcon fontSize="large" color="primary" />,
  },
  {
    title: "Chứng chỉ & Thành tích",
    description:
      "Nhận chứng chỉ sau khi hoàn thành khóa học và theo dõi thành tích cá nhân.",
    icon: <AchievementIcon fontSize="large" color="primary" />,
  },
  {
    title: "Theo dõi tiến độ",
    description:
      "Hệ thống theo dõi tiến độ học tập chi tiết giúp bạn nắm rõ quá trình phát triển.",
    icon: <ProgressIcon fontSize="large" color="primary" />,
  },
];

// Data for statistics
const statistics = [
  { label: "Khóa học", value: "500+" },
  { label: "Người học", value: "10,000+" },
  { label: "Giờ học", value: "25,000+" },
  { label: "Chứng chỉ cấp", value: "8,500+" },
];

// Data for testimonials
const testimonials = [
  {
    quote:
      "Hệ thống đào tạo này đã giúp tôi nâng cao kỹ năng chuyên môn và thăng tiến trong sự nghiệp.",
    author: "Nguyễn Văn A",
    position: "Trưởng phòng Marketing",
    avatar: "/assets/avatars/avatar1.jpg",
  },
  {
    quote:
      "Tôi có thể học bất cứ lúc nào phù hợp với lịch trình bận rộn của mình. Các khóa học rất thực tế và áp dụng được ngay.",
    author: "Trần Thị B",
    position: "Chuyên viên Nhân sự",
    avatar: "/assets/avatars/avatar2.jpg",
  },
  {
    quote:
      "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc. Tôi đánh giá cao sự chuyên nghiệp của hệ thống này.",
    author: "Lê Văn C",
    position: "Kỹ sư Phần mềm",
    avatar: "/assets/avatars/avatar3.jpg",
  },
];

// Benefits data
const benefits = [
  {
    title: "Phát triển kỹ năng",
    description:
      "Nâng cao năng lực chuyên môn và kỹ năng mềm cần thiết cho công việc.",
    icon: <GrowthIcon fontSize="large" sx={{ color: "#4caf50" }} />,
  },
  {
    title: "Thúc đẩy sự nghiệp",
    description:
      "Mở ra cơ hội thăng tiến và phát triển sự nghiệp trong tổ chức.",
    icon: <ProgressIcon fontSize="large" sx={{ color: "#2196f3" }} />,
  },
  {
    title: "Xây dựng đội ngũ",
    description:
      "Tạo văn hóa học tập liên tục và nâng cao hiệu suất toàn đội ngũ.",
    icon: <TeamIcon fontSize="large" sx={{ color: "#ff9800" }} />,
  },
];

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const featuresRef = useRef<HTMLDivElement>(null);
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const navigate = useNavigate();
  return (
    <Box component="main">
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Grid container spacing={15} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.0rem", md: "2.0rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                FCP IT Company – Hệ thống đào tạo cho doanh nghiệp hiện đại
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Giải pháp đào tạo toàn diện giúp nhân viên phát triển kỹ năng và
                nâng cao hiệu suất
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  sx={{ px: 4, py: 1.5 }}
                  onClick={() => navigate(PATH.COURSES)}
                >
                  Bắt đầu học ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderColor: "white",
                    },
                  }}
                  onClick={scrollToFeatures}
                >
                  Tìm hiểu thêm
                </Button>
              </Stack>
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src={HeroImage}
                alt="Learning Platform"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  borderRadius: 2,
                  boxShadow: theme.shadows[10],
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <SectionWrapper ref={featuresRef}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Tính năng nổi bật
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 700, mx: "auto" }}>
              Hệ thống học tập của chúng tôi được thiết kế để đáp ứng mọi nhu
              cầu phát triển kỹ năng trong doanh nghiệp
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <FeatureCard>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionWrapper>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: theme.palette.background.default }}>
        <SectionWrapper>
          <Container>
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  src={BenefitImage}
                  alt="Benefits"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Lợi ích khi sử dụng hệ thống
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  Đầu tư vào việc học tập và phát triển nhân viên mang lại nhiều
                  lợi ích cho cả cá nhân và tổ chức
                </Typography>

                <Box sx={{ mt: 4 }}>
                  {benefits.map((benefit, index) => (
                    <Box key={index} sx={{ display: "flex", mb: 3 }}>
                      <Box sx={{ mr: 2 }}>{benefit.icon}</Box>
                      <Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </SectionWrapper>
      </Box>

      {/* Statistics Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <SectionWrapper sx={{ py: 6 }}>
          <Container>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, mb: 6 }}
            >
              Thành tựu của chúng tôi
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {statistics.map((stat, index) => (
                <Grid size={{ xs: 6, md: 3 }} key={index}>
                  <StatCard elevation={0}>
                    <Typography
                      variant="h3"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </StatCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SectionWrapper>
      </Box>

      {/* Testimonials Section */}
      <SectionWrapper>
        <Container>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Trải nghiệm thực tế từ đội ngũ
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 700, mx: "auto" }}>
              Những phản hồi từ người dùng thực tế về trải nghiệm học tập trên
              hệ thống của chúng tôi
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <TestimonialCard>
                  <CardContent sx={{ p: 4, pt: 4 }}>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ fontStyle: "italic" }}
                    >
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.position}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </TestimonialCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionWrapper>

      {/* Call to Action */}
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          py: { xs: 6, md: 10 },
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Sẵn sàng nâng cao kỹ năng của đội ngũ?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, maxWidth: 800, mx: "auto", opacity: 0.9 }}
          >
            Bắt đầu hành trình học tập và phát triển ngay hôm nay thông qua hệ
            thống đào tạo toàn diện của chúng tôi
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              backgroundColor: "white",
              color: theme.palette.secondary.main,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Tham gia ngay
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
