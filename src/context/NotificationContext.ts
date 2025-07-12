import { createContext } from "react";
import type { NotificationContextType } from "./NotificationTypes";

/**
 * Context for application-wide notifications
 */
export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
