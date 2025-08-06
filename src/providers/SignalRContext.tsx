// src/context/SignalRContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import * as signalR from "@microsoft/signalr";
import ToastContent from "@components/ui/atoms/Toast";
import { toast } from "react-toastify";
// import userSession from "@utils/user-session";

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};

// Provider component
export const SignalRProvider = ({ children }: { children: ReactNode }) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [message, setMessage] = useState<string | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isConnectingRef = useRef(false);
  // const profile = userSession.getUserProfile();

  useEffect(() => {
    // Tránh tạo nhiều kết nối khi component re-render
    if (connectionRef.current || isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://its-gamify-eygvdsahhfbha5gg.southeastasia-01.azurewebsites.net/gameHub",
        { withCredentials: false }
      )
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    // Đăng ký các event listeners
    // newConnection.on("UserJoined", (message: string) => {
    //   toast.success(ToastContent, {
    //     data: {
    //       message: `Người chơi đã tham gia!`,
    //     },
    //   });
    //   setMessage(message);
    // });

    newConnection.on("Error", (message: string) => {
      setErrorMessage(message);
      toast.error(ToastContent, {
        data: {
          message: message,
        },
      });
    });
    newConnection.on("Notify", (message: string) => {
      toast.success(ToastContent, {
        data: {
          message: message,
        },
      });
    });

    // Thêm các event khác nếu cần (ví dụ: "OpponentLeft", "HostChanged" từ code C#)
    // newConnection.on("OpponentLeft", () => { /* Xử lý */ });
    // newConnection.on("HostChanged", (newHostId: string) => { /* Xử lý */ });

    // Bắt đầu kết nối
    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("SignalR Connected (Global)");
        isConnectingRef.current = false;
      } catch {
        setErrorMessage("Lỗi kết nối SignalR.");

        // Thử kết nối lại sau 5 giây
        setTimeout(() => {
          isConnectingRef.current = false;
          startConnection();
        }, 5000);
      }
    };

    startConnection();

    // Cleanup function
    return () => {
      const stopConnection = async () => {
        if (
          connectionRef.current &&
          connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
          try {
            await connectionRef.current.stop();
            console.log("SignalR Disconnected");
          } catch (err) {
            console.error("Error stopping SignalR connection:", err);
          }
        }
        connectionRef.current = null;
        isConnectingRef.current = false;
      };

      stopConnection();
    };
  }, []);

  return (
    <SignalRContext.Provider
      value={{ connection, errorMessage, setErrorMessage }}
    >
      {children}
    </SignalRContext.Provider>
  );
};
