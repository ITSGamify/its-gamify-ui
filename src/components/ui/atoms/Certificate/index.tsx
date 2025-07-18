// src/components/ui/Certificate.tsx
import React, { forwardRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import BadgeImage from "@assets/images/Badge.png";
import Deor from "@assets/svgs/Deor.svg";
import CertificateBackground from "@assets/images/cerificate-background.png";
import CertificateFooter from "@assets/images/certificate-footer.png";
import { CourseResult } from "@interfaces/api/course";
import { formatDateToEnglish } from "@utils/date";

interface CertificateProps {
  data: CourseResult;
  preview?: boolean;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ data, preview = false }, ref) => {
    return (
      <Paper
        ref={ref}
        elevation={preview ? 3 : 0}
        sx={{
          width: {
            xs: "100%",
            sm: "95vw",
            md: "80vw",
            lg: "80vw",
            xl: "1100px",
          },
          maxWidth: "1200px",
          aspectRatio: "297/210",
          height: "auto",
          position: "relative",
          backgroundColor: "#FFFFFF",
          borderRadius: preview ? 2 : 0,
          overflow: "hidden",
          fontFamily: '"Times New Roman", serif',
          mx: "auto", // Center on screen

          "@media print": {
            width: "297mm",
            height: "210mm",
            borderRadius: 0,
            boxShadow: "none",
          },
        }}
      >
        {/* SVG Gradient Definition */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient
              id="badgeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#835A2A" />
              <stop offset="100%" stopColor="#D0A674" />
            </linearGradient>
          </defs>
        </svg>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundImage: `url(${CertificateBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.9,
          }}
        />

        <Box
          sx={{
            margin: { xs: "8px", sm: "12px", md: "15px" },
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <img
            src={Deor}
            alt="Certificate Border Frame"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: '"Libre Baskerville", serif',
                    fontWeight: 700,
                    fontSize: {
                      xs: "2.5rem",
                      sm: "3rem",
                      md: "3.5rem",
                      lg: "4rem",
                      xl: "4.5rem",
                    },
                    color: "#1A1A1A",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: { xs: 0, sm: 0 },
                    textShadow: "2px 2px 4px rgba(255,255,255,0.8)",
                  }}
                >
                  CERTIFICATE
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 2, sm: 2.5, md: 3 },
                mb: { xs: 0, sm: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Libre Baskerville", serif',
                    fontWeight: 400,
                    fontSize: {
                      xs: "1rem",
                      sm: "1.2rem",
                      md: "1.3rem",
                      lg: "1.5rem",
                    },
                    color: "#33312A",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                    whiteSpace: "nowrap",
                  }}
                >
                  OF ACHIEVEMENT
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: { xs: 0.5, sm: 1 },
                mb: { xs: 0, sm: 0 },
              }}
            >
              {[1, 2, 3, 4].map((star) => (
                <Typography
                  key={star}
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                    color: "#B8860B",
                    textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                  }}
                >
                  ★
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Recipient Section */}
          <Box sx={{ mt: { xs: 1, sm: 3, md: 2 }, maxWidth: "90%" }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Inter", serif',
                fontWeight: 400,
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                color: "#999",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                mb: { xs: 1, sm: 2 },
                textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              THIS IS PROUDLY PRESENTED TO
            </Typography>

            <Box sx={{ display: "inline-block" }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Island Moments", cursive',
                  fontWeight: 400,
                  fontSize: {
                    xs: "3rem",
                    sm: "4rem",
                    md: "5rem",
                    lg: "5.5rem",
                    xl: "6rem",
                  },
                  color: "#835A2A",
                  mb: 0,
                  fontStyle: "italic",
                  textShadow: "2px 2px 4px rgba(255,255,255,0.8)",
                  lineHeight: 1.1,
                }}
              >
                {data.user.full_name}
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontFamily: '"Times New Roman", serif',
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                color: "#666",
                lineHeight: { xs: 1.6, sm: 1.7, md: 1.8 },
                maxWidth: { xs: 400, sm: 500, md: 600, lg: 650 },
                mx: "auto",
                mt: { xs: 1, sm: 1, md: 2 },
                textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              This certificate acknowledges your outstanding contribution and
              dedication to the{" "}
              <strong style={{ color: "#2C2C2C" }}>{data.course.title}</strong>,
              showcasing your commitment to excellence, innovation, and
              teamwork.
            </Typography>
          </Box>

          {/* Footer Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: { xs: 500, sm: 600, md: 700 },
              mt: { xs: 1, sm: 3, md: 2 },
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* Date */}
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Box
                sx={{
                  pb: 1,
                  mb: 1,
                  minWidth: { xs: 100, sm: 120, md: 140 },
                  mx: "auto",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 1,
                  px: { xs: 1, sm: 2 },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: -2, sm: -3, md: -4 },
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={CertificateFooter}
                    alt="Certificate Footer"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                    color: "#2C2C2C",
                    fontWeight: 500,
                  }}
                >
                  {formatDateToEnglish(data.completed_date)}
                </Typography>
              </Box>
            </Box>

            {/* Award Badge with Gradient */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: { xs: 60, sm: 70, md: 80, lg: 90, xl: 100 },
                  height: { xs: 60, sm: 70, md: 80, lg: 90, xl: 100 },
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Badge SVG with gradient filter */}
                <img
                  src={BadgeImage}
                  alt="Best Award Badge"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    color: "linear-gradient(135deg, #835A2A 0%, #D0A674 100%)",
                  }}
                />
              </Box>
            </Box>

            {/* Signature */}
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Box
                sx={{
                  pb: 1,
                  mb: 1,
                  minWidth: { xs: 100, sm: 120, md: 140 },
                  mx: "auto",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 1,
                  px: { xs: 1, sm: 2 },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 0, sm: 1 },
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={CertificateFooter}
                    alt="Certificate Footer"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily: '"Brush Script MT", cursive',
                    fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                    color: "#B8860B",
                    fontStyle: "italic",
                    textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                  }}
                >
                  Ist - gamify
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }
);

Certificate.displayName = "Certificate";

export default Certificate;
