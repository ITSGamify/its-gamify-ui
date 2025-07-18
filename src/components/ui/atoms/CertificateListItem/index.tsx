// src/components/ui/CertificateListItem.tsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Stack,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  School,
  Person,
  CalendarToday,
  Numbers,
  AccessTime,
  Grade,
} from "@mui/icons-material";
import { CourseResult } from "@interfaces/api/course";
import { formatDateToVietnamese } from "@utils/date";

interface CertificateListItemProps {
  certificate: CourseResult;
  onView?: (id: string) => void;
}

const CertificateListItem: React.FC<CertificateListItemProps> = ({
  certificate,
  onView,
}) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
          transform: "translateX(4px)",
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => onView?.(certificate.id)}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <School sx={{ fontSize: 40 }} />
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  mb: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                {certificate.course.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                its - gamify
              </Typography>
            </Box>
          </Box>

          {/* Main Details */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ mb: 2, flexWrap: "wrap", gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person
                sx={{ fontSize: 18, color: theme.palette.text.secondary }}
              />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Người nhận
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {certificate.user.full_name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday
                sx={{ fontSize: 18, color: theme.palette.text.secondary }}
              />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Ngày hoàn thành
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDateToVietnamese(certificate.completed_date)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Numbers
                sx={{ fontSize: 18, color: theme.palette.text.secondary }}
              />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Số chứng chỉ
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ fontFamily: "monospace" }}
                >
                  #111111
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Additional Info */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
          >
            {certificate.course.duration_in_hours && (
              <Chip
                icon={<AccessTime sx={{ fontSize: 16 }} />}
                label={certificate.course.duration_in_hours}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}

            {certificate.scrore && (
              <Chip
                icon={<Grade sx={{ fontSize: 16 }} />}
                label={`Điểm: ${certificate.scrore}`}
                size="small"
                variant="outlined"
                color="success"
              />
            )}

            {certificate.course && certificate.course.targets.length > 0 && (
              <>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mr: 1 }}
                >
                  Kỹ năng:
                </Typography>
                {certificate.course.targets.slice(0, 3).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {certificate.course.targets.length > 3 && (
                  <Chip
                    label={`+${certificate.course.targets.length - 3} khác`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default CertificateListItem;
