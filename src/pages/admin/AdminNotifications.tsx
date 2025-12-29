import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  useAdminNotifications, 
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/useAdmin';
import { 
  Bell,
  Package,
  AlertTriangle,
  CreditCard,
  RotateCcw,
  Info,
  Check,
  CheckCheck,
  BellOff,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const notificationIcons: Record<string, typeof Bell> = {
  new_order: Package,
  low_stock: AlertTriangle,
  payment: CreditCard,
  return_request: RotateCcw,
  system: Info,
};

const notificationStyles: Record<string, { bg: string; iconBg: string; iconColor: string }> = {
  new_order: {
    bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  low_stock: {
    bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  payment: {
    bg: 'bg-green-50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/30',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  return_request: {
    bg: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  system: {
    bg: 'bg-gray-50 dark:bg-gray-950/20 border-gray-200/50 dark:border-gray-800/30',
    iconBg: 'bg-gray-100 dark:bg-gray-900/30',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
};

export default function AdminNotifications() {
  const { data: notifications = [], isLoading } = useAdminNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={() => markAllRead.mutate()}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <Card className="admin-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-muted-foreground" />
              Recent Notifications
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3 stagger-fade-in">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Bell;
                  const styles = notificationStyles[notification.type] || notificationStyles.system;
                  
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-xl border transition-all duration-200',
                        notification.is_read 
                          ? 'bg-background border-border/50' 
                          : styles.bg
                      )}
                    >
                      <div className={cn(
                        'p-2.5 rounded-xl flex-shrink-0',
                        notification.is_read ? 'bg-muted' : styles.iconBg
                      )}>
                        <Icon className={cn(
                          'h-5 w-5',
                          notification.is_read ? 'text-muted-foreground' : styles.iconColor
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className={cn(
                              "font-medium",
                              !notification.is_read && "text-foreground"
                            )}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <Badge variant="default" className="shrink-0 bg-primary">
                              New
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(notification.created_at), 'MMM d, yyyy • h:mm a')}
                          </span>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markRead.mutate(notification.id)}
                              className="h-8 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <BellOff className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground max-w-sm">
                  You'll be notified about new orders, low stock alerts, and other important updates here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}