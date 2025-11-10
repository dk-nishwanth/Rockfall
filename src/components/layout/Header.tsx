import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Bell, Settings, LogOut, Mountain, LayoutDashboard, AlertTriangle, FileText, Shield, User, MessageSquare, CheckCircle, MapPin } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { cn } from '../ui/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: AlertTriangle, label: 'Alerts', href: '/alerts' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: MessageSquare, label: 'Alert Management', href: '/alert-management', adminOnly: true },
  { icon: Shield, label: 'Admin Panel', href: '/admin', adminOnly: true },
];

export function Header() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [notificationPosition, setNotificationPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isNotificationOpen && notificationRef.current) {
      const rect = notificationRef.current.getBoundingClientRect();
      setNotificationPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isNotificationOpen]);

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <>
      <header className="glass sticky top-0 z-50 border-b border-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl backdrop-blur-sm group-hover:bg-primary/20 transition-all duration-300">
                <Mountain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-mountain-blue bg-clip-text text-transparent">
                  RockGuard AI
                </h1>
              </div>
            </Link>

            {/* Navigation - Clean without backdrop */}
            <nav className="flex items-center gap-4">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                        : "text-foreground hover:text-primary hover:bg-primary/10 hover:scale-105"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  ref={notificationRef}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative hover:bg-accent/50 p-2 rounded-xl transition-colors"
                >
                  <Bell className="h-5 w-5 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User menu - Custom Dropdown */}
              <div className="relative">
                <button 
                  ref={buttonRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-accent/50 px-4 py-2 rounded-xl transition-colors"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-semibold">{user?.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Portal-based dropdown to ensure it's on top */}
      {isDropdownOpen && createPortal(
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-[99998]" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div 
            className="fixed w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-[99999]"
            style={{ 
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
              zIndex: 99999
            }}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              <Link 
                to="/dashboard" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 mr-3" />
                Dashboard
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="h-4 w-4 mr-3" />
                Profile
              </Link>
              
              <Link 
                to="/profile?tab=feedback" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <MessageSquare className="h-4 w-4 mr-3" />
                Report Issue
              </Link>
              
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              
              <button 
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Notification Dropdown Portal */}
      {isNotificationOpen && createPortal(
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-[99997]" 
            onClick={() => setIsNotificationOpen(false)}
          />
          
          {/* Notification Dropdown */}
          <div 
            className="fixed w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-[99998] max-h-96 overflow-hidden"
            style={{ 
              position: 'fixed',
              top: `${notificationPosition.top}px`,
              right: `${notificationPosition.right}px`,
              zIndex: 99998
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        markAllAsRead();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Mark all read
                    </button>
                  )}
                  <Link 
                    to="/notifications"
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Notification Icon */}
                        <div className={`p-1 rounded-full ${
                          notification.type === 'alert' ? 'bg-red-100 dark:bg-red-900/30' :
                          notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                          'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {notification.type === 'alert' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          ) : notification.type === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          ) : notification.type === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        
                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {notification.location && (
                              <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {notification.location}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 5 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <Link 
                  to="/notifications"
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  View all {notifications.length} notifications →
                </Link>
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}