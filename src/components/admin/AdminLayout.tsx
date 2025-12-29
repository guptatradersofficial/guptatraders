import { ReactNode, useState } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  Ticket,
  RotateCcw,
  Bell,
  ChevronLeft,
  X,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminNotifications } from '@/hooks/useAdmin';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/returns', label: 'Returns', icon: RotateCcw },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell, showBadge: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function NavItem({ 
  href, 
  label, 
  icon: Icon, 
  isActive, 
  badge,
  collapsed 
}: { 
  href: string; 
  label: string; 
  icon: typeof LayoutDashboard;
  isActive: boolean;
  badge?: number;
  collapsed?: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        'admin-nav-item group relative',
        isActive 
          ? 'active' 
          : 'text-admin-sidebar-foreground/70 hover:text-admin-sidebar-foreground'
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-white")} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {badge !== undefined && badge > 0 && (
        <Badge 
          variant="destructive" 
          className={cn(
            "h-5 min-w-5 px-1.5 text-xs",
            collapsed && "absolute -top-1 -right-1 scale-75"
          )}
        >
          {badge}
        </Badge>
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
}

function Sidebar({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: (v: boolean) => void }) {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const { data: notifications = [] } = useAdminNotifications();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <motion.div 
      className="flex flex-col h-full bg-admin-sidebar text-admin-sidebar-foreground"
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-white/10 flex items-center",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg">G</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <p className="font-display text-lg font-bold text-white leading-tight">
                  Gupta Traders
                </p>
                <p className="text-xs text-admin-sidebar-foreground/60">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        {!collapsed && (
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-admin-sidebar-foreground/60 hover:text-white hover:bg-admin-sidebar-hover"
            onClick={() => onCollapse(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto stagger-fade-in">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={
              item.href === '/admin' 
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href)
            }
            badge={item.showBadge ? unreadCount : undefined}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        {/* Visit Store Link */}
        <Link
          to="/"
          className={cn(
            "admin-nav-item text-admin-sidebar-foreground/60 hover:text-white mb-2",
            collapsed && "justify-center"
          )}
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Visit Store</span>}
        </Link>

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg bg-admin-sidebar-muted",
          collapsed && "justify-center"
        )}>
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/30">
            <span className="text-sm font-semibold text-primary">
              {profile?.full_name?.charAt(0) || 'A'}
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                className="flex-1 min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-admin-sidebar-foreground/60">Administrator</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sign Out */}
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "w-full mt-2 text-admin-sidebar-foreground/60 hover:text-white hover:bg-admin-sidebar-hover",
            collapsed ? "justify-center px-0" : "justify-start gap-2"
          )}
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </Button>

        {/* Expand button when collapsed */}
        {collapsed && (
          <Button 
            variant="ghost" 
            size="icon"
            className="w-full mt-2 text-admin-sidebar-foreground/60 hover:text-white hover:bg-admin-sidebar-hover"
            onClick={() => onCollapse(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function MobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="lg:hidden sticky top-0 z-50 bg-admin-header border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-muted"
          onClick={onOpenMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">G</span>
          </div>
          <span className="font-display font-bold">Admin</span>
        </div>
        <div className="w-10" />
      </div>
    </header>
  );
}

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const { data: notifications = [] } = useAdminNotifications();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-admin-sidebar z-50 lg:hidden"
          >
            <div className="flex flex-col h-full text-admin-sidebar-foreground">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">G</span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-white">Gupta Traders</p>
                    <p className="text-xs text-admin-sidebar-foreground/60">Admin Panel</p>
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-admin-sidebar-foreground/60 hover:text-white hover:bg-admin-sidebar-hover"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      'admin-nav-item',
                      (item.href === '/admin' 
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.href))
                        ? 'active' 
                        : 'text-admin-sidebar-foreground/70 hover:text-admin-sidebar-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.showBadge && unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-3 border-t border-white/10">
                <Link
                  to="/"
                  className="admin-nav-item text-admin-sidebar-foreground/60 hover:text-white mb-2"
                >
                  <Home className="h-5 w-5" />
                  <span>Visit Store</span>
                </Link>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-admin-sidebar-muted">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                    <span className="text-sm font-semibold text-primary">
                      {profile?.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {profile?.full_name || 'Admin'}
                    </p>
                    <p className="text-xs text-admin-sidebar-foreground/60">Administrator</p>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 justify-start gap-2 text-admin-sidebar-foreground/60 hover:text-white hover:bg-admin-sidebar-hover"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link 
        to="/admin" 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Admin
      </Link>
      {pathSegments.length > 1 && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          <span className="text-foreground font-medium capitalize">
            {pathSegments[pathSegments.length - 1].replace(/-/g, ' ')}
          </span>
        </>
      )}
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-content">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-content">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Button asChild>
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-content">
      {/* Mobile Header */}
      <MobileHeader onOpenMenu={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block h-screen sticky top-0">
          <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar */}
          <div className="hidden lg:flex sticky top-0 z-40 bg-admin-header/80 backdrop-blur-sm border-b border-border px-6 py-4 items-center justify-between">
            <Breadcrumb />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6 admin-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}