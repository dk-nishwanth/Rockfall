import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  location?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'High Risk Rockfall Detected',
    message: 'Sensors have detected increased rockfall activity in Sector 7. Immediate attention required.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    location: 'Sector 7, Mountain Ridge',
    severity: 'high'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Weather Alert',
    message: 'Heavy rainfall expected in the next 24 hours. Monitor rockfall sensors closely.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    location: 'All Sectors',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'info',
    title: 'System Maintenance Complete',
    message: 'Scheduled maintenance on monitoring systems has been completed successfully.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    severity: 'low'
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (for demo purposes)
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const mockNotifications = [
          {
            type: 'alert' as const,
            title: 'Sensor Alert',
            message: 'Unusual vibration detected in monitoring station.',
            location: `Sector ${Math.floor(Math.random() * 10) + 1}`,
            severity: 'medium' as const
          },
          {
            type: 'info' as const,
            title: 'System Update',
            message: 'Monitoring system has been updated with latest algorithms.',
            severity: 'low' as const
          },
          {
            type: 'warning' as const,
            title: 'Weather Warning',
            message: 'Strong winds detected. Increased monitoring recommended.',
            location: 'Mountain Ridge Area',
            severity: 'medium' as const
          }
        ];
        
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
