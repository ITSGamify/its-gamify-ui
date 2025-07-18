// src/interfaces/certificate.ts
export interface CertificateData {
  id: string;
  recipientName: string;
  courseName: string;
  completionDate: Date;
  instructorName?: string;
  instructorSignature?: string;
  organizationName?: string;
  organizationLogo?: string;
  certificateNumber?: string;
  duration?: string;
  grade?: string;
  skills?: string[];
}

export interface CertificateProps {
  data: CertificateData;
  onDownload?: () => void;
  onShare?: () => void;
  preview?: boolean;
}
