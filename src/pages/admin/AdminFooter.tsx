import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useFooterItems, useCreateFooterItem, useUpdateFooterItem, useDeleteFooterItem, FooterItem } from '@/hooks/useFooterItems';
import { Plus, Edit, Trash2, Link as LinkIcon, Save, ExternalLink, GripVertical, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { value: 'quick_links', label: 'Quick Links', description: 'Main navigation links' },
  { value: 'customer_service', label: 'Customer Service', description: 'Help & support links' },
  { value: 'about', label: 'About', description: 'Company information' },
  { value: 'legal', label: 'Legal', description: 'Terms & policies' },
];

interface FormData {
  section: string;
  title: string;
  url: string;
  sort_order: string;
  is_active: boolean;
}

const defaultFormData: FormData = {
  section: 'quick_links',
  title: '',
  url: '',
  sort_order: '0',
  is_active: true,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminFooter() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FooterItem | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const { data: items = [], isLoading } = useFooterItems(true);
  const createItem = useCreateFooterItem();
  const updateItem = useUpdateFooterItem();
  const deleteItem = useDeleteFooterItem();

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: FooterItem) => {
    setEditingItem(item);
    setFormData({
      section: item.section,
      title: item.title,
      url: item.url || '',
      sort_order: String(item.sort_order),
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.section) return;

    const payload = {
      section: formData.section,
      title: formData.title,
      url: formData.url || null,
      sort_order: Number(formData.sort_order) || 0,
      is_active: formData.is_active,
    };

    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, ...payload });
    } else {
      await createItem.mutateAsync(payload);
    }
    setIsDialogOpen(false);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, FooterItem[]>);

  const totalItems = items.length;
  const activeItems = items.filter(i => i.is_active).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              Footer Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize and manage your website footer links
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total Links', value: totalItems, color: 'bg-primary/10 text-primary' },
            { label: 'Active', value: activeItems, color: 'bg-emerald-500/10 text-emerald-600' },
            { label: 'Inactive', value: totalItems - activeItems, color: 'bg-amber-500/10 text-amber-600' },
            { label: 'Sections', value: SECTIONS.length, color: 'bg-blue-500/10 text-blue-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={cn("text-2xl sm:text-3xl font-bold mt-1", stat.color.split(' ')[1])}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sections Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div 
            className="grid gap-4 sm:gap-6 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {SECTIONS.map(section => {
              const sectionItems = (groupedItems[section.value] || []).sort((a, b) => a.sort_order - b.sort_order);
              const activeCount = sectionItems.filter(i => i.is_active).length;
              
              return (
                <motion.div key={section.value} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <LinkIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {section.label}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {section.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {activeCount}/{sectionItems.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {sectionItems.length > 0 ? (
                        <div className="divide-y divide-border/50">
                          <AnimatePresence>
                            {sectionItems.map((item, idx) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ delay: idx * 0.03 }}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-3 group hover:bg-muted/50 transition-colors",
                                  !item.is_active && "opacity-50"
                                )}
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm truncate">
                                      {item.title}
                                    </p>
                                    {!item.is_active && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        Hidden
                                      </Badge>
                                    )}
                                  </div>
                                  {item.url && (
                                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                                      <ExternalLink className="h-3 w-3" />
                                      {item.url}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleOpenEdit(item)}
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Link</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{item.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteItem.mutate(item.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                            <LinkIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">No links yet</p>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="mt-1"
                            onClick={() => {
                              setFormData({ ...defaultFormData, section: section.value });
                              setEditingItem(null);
                              setIsDialogOpen(true);
                            }}
                          >
                            Add first link
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Link' : 'Add New Link'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the footer link details' : 'Create a new link for your website footer'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Section</Label>
              <Select
                value={formData.section}
                onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      <span className="flex items-center gap-2">
                        {s.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Link Title</Label>
              <Input
                id="title"
                placeholder="e.g. Privacy Policy"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="/privacy-policy or https://..."
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Display Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-md border bg-background">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
                    {formData.is_active ? 'Visible' : 'Hidden'}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.section || createItem.isPending || updateItem.isPending}
              className="gap-2"
            >
              {(createItem.isPending || updateItem.isPending) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingItem ? 'Update Link' : 'Create Link'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
