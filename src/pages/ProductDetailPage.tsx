import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getProductBySlug, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || '');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(
      isInWishlist(product.id)
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate('/cart');
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-foreground transition-colors">
                Products
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                to={`/products?category=${product.category.toLowerCase()}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-secondary rounded-xl overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-accent text-accent-foreground">New</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">{discountPercentage}% OFF</Badge>
                )}
              </div>

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() =>
                      setCurrentImageIndex(
                        prev => (prev - 1 + product.images.length) % product.images.length
                      )
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() =>
                      setCurrentImageIndex(prev => (prev + 1) % product.images.length)
                    }
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    Save {discountPercentage}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stockQuantity} available)
                  </span>
                </>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity and actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() =>
                      setQuantity(q => Math.min(product.stockQuantity, q + 1))
                    }
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist(product.id) ? 'fill-current text-destructive' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹10,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{product.specifications.warranty}</p>
                  <p className="text-xs text-muted-foreground">Manufacturer Warranty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30 days return policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="py-6">
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 font-medium">Dimensions</td>
                      <td className="py-3 text-muted-foreground">
                        {product.specifications.dimensions}
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 font-medium">Weight</td>
                      <td className="py-3 text-muted-foreground">
                        {product.specifications.weight}
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 font-medium">Material</td>
                      <td className="py-3 text-muted-foreground">
                        {product.specifications.material}
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 font-medium">Color</td>
                      <td className="py-3 text-muted-foreground">
                        {product.specifications.color}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Warranty</td>
                      <td className="py-3 text-muted-foreground">
                        {product.specifications.warranty}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-6">
              <p className="text-muted-foreground">
                Customer reviews will be displayed here.
              </p>
            </TabsContent>

            <TabsContent value="shipping" className="py-6">
              <div className="max-w-2xl space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Shipping</h3>
                  <p className="text-muted-foreground">
                    Free shipping on orders above ₹10,000. Standard delivery takes 5-7
                    business days. Express delivery available at additional cost.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Returns & Exchanges</h3>
                  <p className="text-muted-foreground">
                    We offer a 30-day return policy for all unused items in original
                    packaging. For furniture items, a restocking fee of 15% may apply.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">You May Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </Layout>
  );
}
