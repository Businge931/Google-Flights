export type NotificationSeverity = "success" | "info" | "warning" | "error";

export interface NotificationContextType {
  showNotification: (message: string, severity?: NotificationSeverity) => void;
  hideNotification: () => void;
}

export interface NotificationState {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
}
