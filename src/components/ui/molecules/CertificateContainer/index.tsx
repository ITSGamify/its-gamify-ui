// src/components/ui/CertificateContainer.tsx
import React, { useRef } from "react";
import {
  Box,
  Button,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { Download, Print, Close } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import Certificate from "@components/ui/atoms/Certificate";

import { CourseResult } from "@interfaces/api/course";
interface CertificateContainerProps {
  data: CourseResult;
  onClose?: () => void;
  fullscreen?: boolean;
}

const CertificateContainer: React.FC<CertificateContainerProps> = ({
  data,
  onClose,
  fullscreen = false,
}) => {
  const theme = useTheme();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: certificateRef, // Changed from 'content' to 'contentRef'
    documentTitle: `Certificate-${data.id}`,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `,
  });

  const handleDownload = async () => {
    try {
      if (certificateRef.current) {
        const html2canvas = (await import("html2canvas")).default;
        const jsPDF = (await import("jspdf")).default;

        await document.fonts.ready;

        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2canvas(certificateRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: true,
          width: certificateRef.current.offsetWidth,
          height: certificateRef.current.offsetHeight,
        });

        const imgData = canvas.toDataURL("image/png", 1.0);

        // Create PDF in landscape A4 format
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = 210; // A4 landscape height in mm

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Generate filename
        const filename = `Certificate-${data.id.replace(
          /\s+/g,
          "_"
        )}-${data.course.id.replace(/\s+/g, "_")}.pdf`;
        pdf.save(filename);
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
    }
  };

  return (
    <Box
      sx={{
        position: fullscreen ? "fixed" : "relative",
        top: fullscreen ? 0 : "auto",
        left: fullscreen ? 0 : "auto",
        right: fullscreen ? 0 : "auto",
        bottom: fullscreen ? 0 : "auto",
        zIndex: fullscreen ? 1300 : "auto",
        backgroundColor: fullscreen
          ? alpha(theme.palette.common.black, 0.8)
          : "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: fullscreen ? 2 : 0,
      }}
    >
      {/* Action Bar */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "297mm",
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: fullscreen
            ? theme.palette.background.paper
            : "transparent",
          borderRadius: 1,
          p: fullscreen ? 1 : 0,
        }}
      >
        <Stack direction="row" spacing={1}>
          <Tooltip title="Tải xuống PDF">
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
              size="small"
            >
              Tải xuống
            </Button>
          </Tooltip>

          <Tooltip title="In chứng chỉ">
            <IconButton onClick={handlePrint} size="small">
              <Print />
            </IconButton>
          </Tooltip>
        </Stack>

        {fullscreen && onClose && (
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Certificate */}
      <Box
        sx={{
          maxWidth: "100%",
          overflow: "auto",
          backgroundColor: theme.palette.background.paper,
          borderRadius: fullscreen ? 0 : 1,
          boxShadow: fullscreen ? "none" : theme.shadows[3],
        }}
      >
        <Certificate ref={certificateRef} data={data} preview={!fullscreen} />
      </Box>
    </Box>
  );
};

export default CertificateContainer;
