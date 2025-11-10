import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../ui/utils';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Activity,
  Map,
  Users
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

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
  { icon: Settings, label: 'Admin Panel', href: '/admin', adminOnly: true },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 z-40",
      isOpen ? "w-64" : "w-16"
    )}>
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm">System Status</span>
            </div>
            <p className="text-xs text-muted-foreground">All sensors online</p>
            <p className="text-xs text-muted-foreground">Last update: 2 min ago</p>
          </div>
        </div>
      )}
    </aside>
  );
}