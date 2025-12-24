import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export function useProductImages(productId: string) {
  return useQuery({
    queryKey: ['product-images', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      return data as ProductImage[];
    },
    enabled: !!productId,
  });
}

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, file, altText, isPrimary }: { 
      productId: string; 
      file: File; 
      altText?: string;
      isPrimary?: boolean;
    }) => {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // If setting as primary, unset other primaries first
      if (isPrimary) {
        await supabase
          .from('product_images')
          .update({ is_primary: false })
          .eq('product_id', productId);
      }

      // Get current max sort order
      const { data: existing } = await supabase
        .from('product_images')
        .select('sort_order')
        .eq('product_id', productId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const sortOrder = existing && existing.length > 0 ? (existing[0].sort_order || 0) + 1 : 0;

      // Insert image record
      const { data, error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: urlData.publicUrl,
          alt_text: altText || null,
          is_primary: isPrimary ?? false,
          sort_order: sortOrder,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-images', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Image uploaded' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error uploading image', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateProductImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, productId, ...updates }: { 
      id: string; 
      productId: string;
      alt_text?: string;
      is_primary?: boolean;
      sort_order?: number;
    }) => {
      // If setting as primary, unset other primaries first
      if (updates.is_primary) {
        await supabase
          .from('product_images')
          .update({ is_primary: false })
          .eq('product_id', productId);
      }

      const { data, error } = await supabase
        .from('product_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, productId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-images', data.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Image updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating image', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, productId, imageUrl }: { id: string; productId: string; imageUrl: string }) => {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/product-images/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage
          .from('product-images')
          .remove([filePath]);
      }

      // Delete the record
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { productId };
    },
    onSuccess: ({ productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Image deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting image', description: error.message, variant: 'destructive' });
    },
  });
}
