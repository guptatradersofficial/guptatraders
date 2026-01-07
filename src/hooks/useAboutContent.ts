import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AboutContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useAboutContentList(includeInactive = false) {
  return useQuery({
    queryKey: ['about-content', includeInactive],
    queryFn: async () => {
      try {
        let query = (supabase
          .from('about_content' as any)
          .select('*')
          .order('sort_order')) as any;

        if (!includeInactive) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching about content:', error);
          // Return empty array if table doesn't exist yet
          return [];
        }
        return data as AboutContent[];
      } catch (err) {
        console.error('Error in useAboutContentList:', err);
        return [];
      }
    },
    retry: false,
  });
}

export function useUpdateAboutContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<AboutContent> & { id: string }) => {
      try {
        const { error } = await (supabase
          .from('about_content' as any)
          .update(item)
          .eq('id', id)) as any;

        if (error) throw error;
        
        // Fetch the updated item to return
        const { data, error: fetchError } = await (supabase
          .from('about_content' as any)
          .select('*')
          .eq('id', id)
          .single()) as any;

        if (fetchError) throw fetchError;
        return data;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] });
      toast({ 
        title: 'Content saved successfully', 
        variant: 'default' 
      });
    },
    onError: (error: Error) => {
      console.error('Update error:', error);
      toast({ 
        title: 'Error saving content', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });
}

export function useAboutContentByKey(sectionKey: string) {
  return useQuery({
    queryKey: ['about-content', sectionKey],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('about_content' as any)
        .select('*')
        .eq('section_key', sectionKey)
        .single()) as any;

      if (error) throw error;
      return data as AboutContent;
    },
  });
}
