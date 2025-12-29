import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminOrders } from '@/hooks/useOrders';
import { useAdminProducts } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { data: orders = [] } = useAdminOrders();
  const { data: products = [] } = useAdminProducts();

  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  
  const lowStockProducts = products.filter(
    p => p.stock_quantity <= (p.low_stock_threshold || 5)
  );

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      subtitle: 'From paid orders',
      icon: DollarSign,
      colorClass: 'admin-stat-1',
      iconBg: 'bg-admin-stat-1/10',
      iconColor: 'text-admin-stat-1',
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      subtitle: `${pendingOrders} pending, ${processingOrders} processing`,
      icon: ShoppingCart,
      colorClass: 'admin-stat-2',
      iconBg: 'bg-admin-stat-2/10',
      iconColor: 'text-admin-stat-2',
    },
    {
      title: 'Products',
      value: products.length.toString(),
      subtitle: `${products.filter(p => p.is_active).length} active`,
      icon: Package,
      colorClass: 'admin-stat-3',
      iconBg: 'bg-admin-stat-3/10',
      iconColor: 'text-admin-stat-3',
    },
    {
      title: 'Low Stock',
      value: lowStockProducts.length.toString(),
      subtitle: 'Products need restocking',
      icon: AlertTriangle,
      colorClass: 'admin-stat-4',
      iconBg: 'bg-admin-stat-4/10',
      iconColor: 'text-admin-stat-4',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your store.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/orders" className="gap-2">
              View Orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-fade-in">
          {stats.map((stat, index) => (
            <div 
              key={stat.title}
              className={cn("admin-stat-card p-6", stat.colorClass)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={cn("p-3 rounded-xl", stat.iconBg)}>
                  <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                Recent Orders
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/orders" className="gap-1 text-primary">
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-3 stagger-fade-in">
                  {recentOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold">{formatPrice(Number(order.total_amount))}</p>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        )}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/products" className="gap-1 text-primary">
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3 stagger-fade-in">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div 
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-amber-600 dark:text-amber-400">
                          {product.stock_quantity} left
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Min: {product.low_stock_threshold || 5}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-10 w-10 text-green-500/50 mb-3" />
                  <p className="text-muted-foreground">All products are well stocked</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/products">
                  <Package className="h-5 w-5" />
                  <span>Add Product</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/orders">
                  <ShoppingCart className="h-5 w-5" />
                  <span>View Orders</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/customers">
                  <Users className="h-5 w-5" />
                  <span>Manage Customers</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link to="/admin/settings">
                  <TrendingUp className="h-5 w-5" />
                  <span>Store Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}