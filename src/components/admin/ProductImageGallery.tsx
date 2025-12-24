import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useProductImages,
  useUploadProductImage,
  useUpdateProductImage,
  useDeleteProductImage,
} from '@/hooks/useProductImages';
import {
  Upload,
  Trash2,
  Star,
  StarOff,
  GripVertical,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
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

interface ProductImageGalleryProps {
  productId: string;
}

export function ProductImageGallery({ productId }: ProductImageGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [altText, setAltText] = useState('');

  const { data: images = [], isLoading } = useProductImages(productId);
  const uploadImage = useUploadProductImage();
  const updateImage = useUpdateProductImage();
  const deleteImage = useDeleteProductImage();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isPrimary = images.length === 0 && i === 0;
        await uploadImage.mutateAsync({ productId, file, isPrimary });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    await updateImage.mutateAsync({ id: imageId, productId, is_primary: true });
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    await deleteImage.mutateAsync({ id: imageId, productId, imageUrl });
  };

  const handleSaveAltText = async (imageId: string) => {
    await updateImage.mutateAsync({ id: imageId, productId, alt_text: altText });
    setEditingAlt(null);
    setAltText('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Supports JPG, PNG, WebP. Multiple files allowed.
        </p>
      </div>

      {/* Image Gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Product image'}
                  className="w-full h-full object-cover"
                />
                
                {/* Primary Badge */}
                {image.is_primary && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Primary
                  </Badge>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.is_primary && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleSetPrimary(image.id)}
                      title="Set as primary"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(image.id, image.image_url)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Alt Text Input */}
              <div className="p-2">
                {editingAlt === image.id ? (
                  <div className="flex gap-1">
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Alt text"
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 px-2"
                      onClick={() => handleSaveAltText(image.id)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <p
                    className="text-xs text-muted-foreground truncate cursor-pointer hover:text-foreground"
                    onClick={() => {
                      setEditingAlt(image.id);
                      setAltText(image.alt_text || '');
                    }}
                  >
                    {image.alt_text || 'Click to add alt text'}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No images yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload images to showcase this product
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
      )}
    </div>
  );
}
