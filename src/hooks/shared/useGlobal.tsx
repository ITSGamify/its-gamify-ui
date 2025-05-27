import { GlobalContext } from "@providers/GlobalProvider";
import { useContext } from "react";

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within an GlobalProvider");
  }
  return context;
};
