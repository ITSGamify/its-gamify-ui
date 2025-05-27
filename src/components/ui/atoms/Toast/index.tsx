import { ToastContentProps, TypeOptions } from "react-toastify";
import { CheckCircle, Info, Warning, Error, Close } from "@mui/icons-material";

interface ToastIconProps {
  severity?: TypeOptions;
}

interface ToastDataProps {
  message: string;
  errorCode?: string;
}

// Component Icon cho Toast
const ToastIcon = ({ severity }: ToastIconProps) => {
  switch (severity) {
    case "success":
      return <CheckCircle className="text-green-500" />;
    case "info":
      return <Info className="text-blue-500" />;
    case "warning":
      return <Warning className="text-yellow-500" />;
    case "error":
      return <Error className="text-red-500" />;
    default:
      return <Info className="text-blue-500" />;
  }
};

const ToastContent = (props: ToastContentProps<ToastDataProps>) => {
  const severity = props.toastProps.type;
  const { message, errorCode } = props.data || { message: "" };
  const isErrorWithCode = errorCode && message;

  return (
    <div className="flex items-start gap-3 w-full">
      {/* Icon bên trái */}
      <div className="flex-shrink-0 pt-0.5">
        <ToastIcon severity={severity} />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        {isErrorWithCode ? (
          <>
            <div className="font-medium">Error {errorCode}</div>
            <div className="text-sm opacity-90 mt-1">{message}</div>
          </>
        ) : (
          <div className="font-medium">{message}</div>
        )}
      </div>

      {/* Nút đóng (tùy chọn - react-toastify đã có sẵn) */}
      {props.closeToast && (
        <button
          onClick={props.closeToast}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <Close fontSize="small" />
        </button>
      )}
    </div>
  );
};

export default ToastContent;
