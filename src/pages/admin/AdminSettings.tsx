import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  useShippingZones, 
  useCreateShippingZone, 
  useUpdateShippingZone,
  useDeleteShippingZone,
  useActivityLogs,
} from '@/hooks/useAdmin';
import { 
  Settings, 
  Truck, 
  Shield, 
  History,
  Plus,
  Edit,
  Trash2,
  Save,
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function AdminSettings() {
  const { data: shippingZones = [], isLoading: zonesLoading } = useShippingZones();
  const { data: activityLogs = [], isLoading: logsLoading } = useActivityLogs();
  
  const createZone = useCreateShippingZone();
  const updateZone = useUpdateShippingZone();
  const deleteZone = useDeleteShippingZone();

  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [zoneForm, setZoneForm] = useState({
    name: '',
    regions: '',
    base_rate: 0,
    per_kg_rate: 0,
    free_shipping_threshold: 0,
    estimated_days_min: 3,
    estimated_days_max: 7,
    is_active: true,
  });

  const resetZoneForm = () => {
    setZoneForm({
      name: '',
      regions: '',
      base_rate: 0,
      per_kg_rate: 0,
      free_shipping_threshold: 0,
      estimated_days_min: 3,
      estimated_days_max: 7,
      is_active: true,
    });
    setEditingZone(null);
  };

  const handleEditZone = (zone: any) => {
    setEditingZone(zone);
    setZoneForm({
      name: zone.name,
      regions: zone.regions.join(', '),
      base_rate: zone.base_rate,
      per_kg_rate: zone.per_kg_rate || 0,
      free_shipping_threshold: zone.free_shipping_threshold || 0,
      estimated_days_min: zone.estimated_days_min,
      estimated_days_max: zone.estimated_days_max,
      is_active: zone.is_active,
    });
    setIsZoneDialogOpen(true);
  };

  const handleSaveZone = async () => {
    const zoneData = {
      name: zoneForm.name,
      regions: zoneForm.regions.split(',').map(r => r.trim()).filter(Boolean),
      base_rate: zoneForm.base_rate,
      per_kg_rate: zoneForm.per_kg_rate || null,
      free_shipping_threshold: zoneForm.free_shipping_threshold || null,
      estimated_days_min: zoneForm.estimated_days_min,
      estimated_days_max: zoneForm.estimated_days_max,
      is_active: zoneForm.is_active,
    };

    if (editingZone) {
      await updateZone.mutateAsync({ id: editingZone.id, ...zoneData });
    } else {
      await createZone.mutateAsync(zoneData);
    }
    setIsZoneDialogOpen(false);
    resetZoneForm();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your store settings</p>
        </div>

        <Tabs defaultValue="shipping" className="space-y-6">
          <TabsList>
            <TabsTrigger value="shipping" className="gap-2">
              <Truck className="h-4 w-4" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <History className="h-4 w-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          {/* Shipping Settings */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Shipping Zones</CardTitle>
                  <CardDescription>Configure delivery regions and rates</CardDescription>
                </div>
                <Dialog open={isZoneDialogOpen} onOpenChange={(open) => {
                  setIsZoneDialogOpen(open);
                  if (!open) resetZoneForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Zone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingZone ? 'Edit Shipping Zone' : 'Add Shipping Zone'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Zone Name</Label>
                        <Input
                          value={zoneForm.name}
                          onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                          placeholder="e.g. North India"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Regions (comma separated)</Label>
                        <Input
                          value={zoneForm.regions}
                          onChange={(e) => setZoneForm({ ...zoneForm, regions: e.target.value })}
                          placeholder="Delhi, Punjab, Haryana"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Base Rate (₹)</Label>
                          <Input
                            type="number"
                            value={zoneForm.base_rate}
                            onChange={(e) => setZoneForm({ ...zoneForm, base_rate: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Per KG Rate (₹)</Label>
                          <Input
                            type="number"
                            value={zoneForm.per_kg_rate}
                            onChange={(e) => setZoneForm({ ...zoneForm, per_kg_rate: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Free Shipping Threshold (₹)</Label>
                        <Input
                          type="number"
                          value={zoneForm.free_shipping_threshold}
                          onChange={(e) => setZoneForm({ ...zoneForm, free_shipping_threshold: Number(e.target.value) })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Min Delivery Days</Label>
                          <Input
                            type="number"
                            value={zoneForm.estimated_days_min}
                            onChange={(e) => setZoneForm({ ...zoneForm, estimated_days_min: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Delivery Days</Label>
                          <Input
                            type="number"
                            value={zoneForm.estimated_days_max}
                            onChange={(e) => setZoneForm({ ...zoneForm, estimated_days_max: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Active</Label>
                        <Switch
                          checked={zoneForm.is_active}
                          onCheckedChange={(checked) => setZoneForm({ ...zoneForm, is_active: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsZoneDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleSaveZone} disabled={createZone.isPending || updateZone.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {createZone.isPending || updateZone.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {zonesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : shippingZones.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zone</TableHead>
                        <TableHead>Regions</TableHead>
                        <TableHead>Base Rate</TableHead>
                        <TableHead>Free Above</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shippingZones.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell className="font-medium">{zone.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{zone.regions.join(', ')}</TableCell>
                          <TableCell>₹{zone.base_rate}</TableCell>
                          <TableCell>{zone.free_shipping_threshold ? `₹${zone.free_shipping_threshold}` : '-'}</TableCell>
                          <TableCell>{zone.estimated_days_min}-{zone.estimated_days_max} days</TableCell>
                          <TableCell>
                            <Badge variant={zone.is_active ? 'default' : 'secondary'}>
                              {zone.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditZone(zone)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive"
                                onClick={() => deleteZone.mutate(zone.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No shipping zones</h3>
                    <p className="text-muted-foreground mb-4">Add zones to configure shipping rates</p>
                    <Button onClick={() => setIsZoneDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Zone
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Row Level Security</h4>
                    <p className="text-sm text-muted-foreground">Database-level access controls are enabled</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Authentication</h4>
                    <p className="text-sm text-muted-foreground">Email/password authentication is active</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Admin Role</h4>
                    <p className="text-sm text-muted-foreground">Role-based access control for admin features</p>
                  </div>
                  <Badge variant="default">Configured</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Track admin actions and changes</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : activityLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity Type</TableHead>
                        <TableHead>Entity ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(log.created_at), 'PPp')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.entity_type}</TableCell>
                          <TableCell className="font-mono text-sm">{log.entity_id || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No activity logs yet</h3>
                    <p className="text-muted-foreground">Admin actions will be logged here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
