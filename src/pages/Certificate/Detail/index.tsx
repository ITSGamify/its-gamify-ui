// src/pages/Certificate/CertificatePage.tsx
import React, { useState } from "react";
import { Box, Container, Button } from "@mui/material";
import CertificateContainer from "@components/ui/molecules/CertificateContainer";
import { useCourseResultDetailPage } from "@hooks/data/useCourseResultDetailPage";

const CertificateDetailPage: React.FC = () => {
  const [showFullscreen, setShowFullscreen] = useState(false);

  const { courseDetail } = useCourseResultDetailPage();

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          onClick={() => setShowFullscreen(true)}
          sx={{ mr: 2 }}
        >
          View Fullscreen
        </Button>
      </Box>

      {courseDetail && (
        <CertificateContainer
          data={courseDetail}
          fullscreen={showFullscreen}
          onClose={() => setShowFullscreen(false)}
        />
      )}
    </Container>
  );
};

export default CertificateDetailPage;
