import { mockNotifications, type Notification } from '@/lib/communityData';

let notifications = [...mockNotifications];

export const notificationService = {
  getAll: (): Notification[] => notifications,

  getUnread: (): Notification[] => notifications.filter(n => !n.read),

  getUnreadCount: (): number => notifications.filter(n => !n.read).length,

  markAsRead: (id: string): void => {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  },

  markAllRead: (): void => {
    notifications = notifications.map(n => ({ ...n, read: true }));
  },
};
