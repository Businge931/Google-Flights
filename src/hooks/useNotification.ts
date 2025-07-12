import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

/**
 * Hook to access the notification context
 * @returns NotificationContext functions
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
