import { createContext } from 'react';
import type { NotificationContextType } from './NotificationTypes';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
