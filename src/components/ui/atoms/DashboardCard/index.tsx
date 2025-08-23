// src/components/DashboardCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  styled,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DashboardCardProps } from "@interfaces/shared/home";
// Styled components
const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme }) => ({
  borderRadius: theme.shape.borderRadius, // 12px theo theme
  boxShadow: theme.shadows[2],
  height: "100%",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
  },
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme }) => ({
  width: 48,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

// Component chính
const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color = "primary",
  progress,
  subtitle,
  isLoading = false,
}) => {
  return (
    <StyledCard color={color}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            {isLoading ? (
              <>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={40} />
                {subtitle && (
                  <Skeleton variant="text" width={150} height={16} />
                )}
              </>
            ) : (
              <>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {title}
                </Typography>
                <Typography variant="h4">{value}</Typography>
                {subtitle && (
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {subtitle}
                  </Typography>
                )}
              </>
            )}
          </Box>
          {isLoading ? (
            <Skeleton variant="circular" width={48} height={40} />
          ) : (
            <IconBox color={color}>{icon}</IconBox>
          )}
        </Box>

        {(progress !== undefined || isLoading) && (
          <Box mt={2}>
            {isLoading ? (
              <>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Skeleton variant="text" width={60} height={16} />
                  <Skeleton variant="text" width={30} height={16} />
                </Box>
                <Skeleton
                  variant="rectangular"
                  height={6}
                  width="100%"
                  sx={{ borderRadius: 3 }}
                />
              </>
            ) : (
              <>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Tiến độ
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  color={color as any}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </>
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default DashboardCard;
