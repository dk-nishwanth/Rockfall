import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/layout/Header';
import { LoginPage } from './components/auth/LoginPage';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { NotificationProvider } from './components/contexts/NotificationContext';
import { PageLoadingSpinner } from './components/ui/loading-spinner';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./components/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const AlertsPage = lazy(() => import('./components/pages/AlertsPage').then(module => ({ default: module.AlertsPage })));
const ReportsPage = lazy(() => import('./components/pages/ReportsPage').then(module => ({ default: module.ReportsPage })));
const AdminPanel = lazy(() => import('./components/pages/AdminPanel').then(module => ({ default: module.AdminPanel })));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const NotificationsPage = lazy(() => import('./components/pages/NotificationsPage').then(module => ({ default: module.NotificationsPage })));
const AlertManagement = lazy(() => import('./components/pages/AlertManagement').then(module => ({ default: module.AlertManagement })));

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Mountain Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(93, 173, 226, 0.1) 0%, rgba(44, 62, 80, 0.05) 50%, rgba(93, 173, 226, 0.1) 100%), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23e8f4f8;stop-opacity:0.3" /><stop offset="100%" style="stop-color:%23d1e7dd;stop-opacity:0.2" /></linearGradient><linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23ffffff;stop-opacity:0.8" /><stop offset="30%" style="stop-color:%23f8f9fa;stop-opacity:0.6" /><stop offset="70%" style="stop-color:%236c757d;stop-opacity:0.4" /><stop offset="100%" style="stop-color:%23495057;stop-opacity:0.3" /></linearGradient><linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23f8f9fa;stop-opacity:0.6" /><stop offset="50%" style="stop-color:%23adb5bd;stop-opacity:0.4" /><stop offset="100%" style="stop-color:%23495057;stop-opacity:0.3" /></linearGradient></defs><rect width="1200" height="800" fill="url(%23sky)"/><polygon points="0,800 0,400 200,200 400,300 600,250 800,350 1000,300 1200,400 1200,800" fill="url(%23mountain1)"/><polygon points="100,800 100,500 300,300 500,400 700,350 900,450 1100,400 1200,500 1200,800" fill="url(%23mountain2)" opacity="0.6"/><polygon points="200,800 200,600 400,450 600,500 800,480 1000,550 1200,600 1200,800" fill="%23343a40" opacity="0.3"/></svg>')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          <Suspense fallback={<PageLoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/alert-management" element={<AlertManagement />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}