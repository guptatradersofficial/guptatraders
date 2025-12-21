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

const notificationColors: Record<string, string> = {
  new_order: 'text-blue-500',
  low_stock: 'text-yellow-500',
  payment: 'text-green-500',
  return_request: 'text-purple-500',
  system: 'text-gray-500',
};

export default function AdminNotifications() {
  const { data: notifications = [], isLoading } = useAdminNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={() => markAllRead.mutate()}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Bell;
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                        notification.is_read ? 'bg-background' : 'bg-muted/50'
                      )}
                    >
                      <div className={cn('mt-0.5', notificationColors[notification.type])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <Badge variant="default" className="shrink-0">New</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(notification.created_at), 'PPp')}
                          </span>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markRead.mutate(notification.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
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
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You'll be notified about new orders, low stock, and more
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
