import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(
      isInWishlist(product.id)
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="relative bg-card rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300">
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-accent text-accent-foreground">New</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">{discountPercentage}% OFF</Badge>
              )}
              {product.isBestseller && (
                <Badge variant="secondary">Bestseller</Badge>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant={isInWishlist(product.id) ? 'default' : 'secondary'}
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handleToggleWishlist}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                />
              </Button>
            </div>

            {/* Add to cart button */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="font-medium text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-card-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock status */}
            {!product.inStock && (
              <p className="text-sm text-destructive mt-2">Out of Stock</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
