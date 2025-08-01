// src/context/SignalRContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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

  // const profile = userSession.getUserProfile();

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5131/gameHub", { withCredentials: false })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.on("UserJoined", (joinedUserId: string) => {
      console.log(`User ${joinedUserId} joined the room`);
      toast.success(ToastContent, {
        data: {
          message: "Hãy chuẩn bị sẵn sàng!",
        },
      });
    });

    newConnection.on("Error", (message: string) => {
      setErrorMessage(message);
      toast.error(ToastContent, {
        data: {
          message: message,
        },
      });
    });

    // Thêm các event khác nếu cần (ví dụ: "OpponentLeft", "HostChanged" từ code C#)
    // newConnection.on("OpponentLeft", () => { /* Xử lý */ });
    // newConnection.on("HostChanged", (newHostId: string) => { /* Xử lý */ });

    newConnection
      .start()
      .then(() => console.log("SignalR Connected (Global)"))
      .catch((err) => {
        console.error("SignalR Connection Error: ", err);
        setErrorMessage("Lỗi kết nối SignalR.");
      });

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
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
