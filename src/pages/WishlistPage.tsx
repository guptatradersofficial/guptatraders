import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { getWishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const wishlistItems = getWishlistItems();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(productId);
    toast.success(`${productName} added to cart`);
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  if (wishlistItems.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Heart className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Save your favorite items here for later. Start exploring and add
              products you love!
            </p>
            <Button asChild size="lg">
              <Link to="/products">Explore Products</Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold mb-8"
        >
          My Wishlist ({wishlistItems.length} items)
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl overflow-hidden card-shadow"
            >
              <Link to={`/product/${product.slug}`}>
                <div className="aspect-square bg-secondary">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link
                  to={`/product/${product.slug}`}
                  className="font-semibold hover:text-primary transition-colors line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.category}
                </p>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-semibold">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => handleAddToCart(product.id, product.name)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => handleRemove(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
