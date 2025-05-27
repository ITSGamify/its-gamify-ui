import { ToastContext } from "@providers/ToastProvider";
import { useContext } from "react";

export const useToast = () => useContext(ToastContext);
