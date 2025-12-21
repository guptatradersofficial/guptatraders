import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReturns, useUpdateReturn } from '@/hooks/useAdmin';
import { 
  Search,
  RotateCcw,
  Eye,
  Check,
  X,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
};

const refundStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function AdminReturns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const { data: returns = [], isLoading } = useReturns();
  const updateReturn = useUpdateReturn();

  const filteredReturns = returns.filter(r => {
    const matchesSearch = r.order?.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async () => {
    if (!selectedReturn) return;
    await updateReturn.mutateAsync({
      id: selectedReturn.id,
      status: 'approved',
      refund_amount: refundAmount,
      refund_status: 'pending',
    });
    setSelectedReturn(null);
  };

  const handleReject = async (returnId: string) => {
    await updateReturn.mutateAsync({
      id: returnId,
      status: 'rejected',
    });
  };

  const handleComplete = async (returnId: string) => {
    await updateReturn.mutateAsync({
      id: returnId,
      status: 'completed',
      refund_status: 'processed',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Returns & Refunds</h1>
          <p className="text-muted-foreground">Handle return requests and process refunds</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Return Requests ({returns.length})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search returns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredReturns.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Order Total</TableHead>
                      <TableHead>Refund Amount</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Refund Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-medium">
                          {returnItem.order?.order_number || 'N/A'}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{returnItem.reason}</p>
                          {returnItem.description && (
                            <p className="text-xs text-muted-foreground truncate">{returnItem.description}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(returnItem.created_at), 'PP')}
                        </TableCell>
                        <TableCell>
                          ₹{returnItem.order?.total_amount?.toLocaleString() || '-'}
                        </TableCell>
                        <TableCell>
                          {returnItem.refund_amount ? `₹${returnItem.refund_amount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusColors[returnItem.status]}>
                            {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {returnItem.refund_status ? (
                            <Badge className={refundStatusColors[returnItem.refund_status]}>
                              {returnItem.refund_status.charAt(0).toUpperCase() + returnItem.refund_status.slice(1)}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {returnItem.status === 'pending' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setSelectedReturn(returnItem);
                                    setRefundAmount(returnItem.order?.total_amount || 0);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive"
                                  onClick={() => handleReject(returnItem.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {returnItem.status === 'approved' && returnItem.refund_status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-green-600"
                                onClick={() => handleComplete(returnItem.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No return requests</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' ? 'Try different filters' : 'Return requests will appear here'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approve Return Dialog */}
        <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Return Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="font-medium">{selectedReturn?.order?.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p>{selectedReturn?.reason}</p>
                {selectedReturn?.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedReturn.description}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Refund Amount (₹)</Label>
                <Input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Order total: ₹{selectedReturn?.order?.total_amount?.toLocaleString()}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedReturn(null)}>Cancel</Button>
              <Button onClick={handleApprove} disabled={updateReturn.isPending}>
                {updateReturn.isPending ? 'Approving...' : 'Approve & Process Refund'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
