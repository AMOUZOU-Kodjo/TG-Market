import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

export function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotificationContext doit être utilisé dans un NotificationProvider"
    );
  }

  return context;
}
