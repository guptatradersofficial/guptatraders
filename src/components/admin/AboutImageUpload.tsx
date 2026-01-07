import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AboutImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: number;
}

export function AboutImageUpload({ 
  value, 
  onChange, 
  label = 'Image',
  aspectRatio = 16 / 9 
}: AboutImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `about-${Date.now()}.${fileExtension}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(`about/${fileName}`, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(`about/${fileName}`);

      onChange(data.publicUrl);
      toast({
        title: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const paddingBottom = `${(1 / aspectRatio) * 100}%`;

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs sm:text-sm font-semibold text-foreground block">
          {label}
        </label>
      )}
      
      {value ? (
        <div className="space-y-2 w-full">
          <div 
            className="relative w-full overflow-hidden rounded-lg border-2 border-border/50 bg-muted"
            style={{ paddingBottom }}
          >
            <img
              src={value}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] sm:text-xs h-7 sm:h-8 gap-1 sm:gap-1.5"
            onClick={handleRemove}
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Remove</span>
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative w-full border-2 border-dashed rounded-lg p-3 sm:p-4 transition-colors cursor-pointer',
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border/50 hover:border-border bg-muted/20 hover:bg-muted/40'
          )}
          style={{ paddingBottom }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
                <p className="text-[10px] sm:text-xs text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs font-medium text-foreground">
                    Drop image here
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                    or click to select
                  </p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
