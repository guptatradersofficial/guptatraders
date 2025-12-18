import diningTableImg from '@/assets/products/dining-table.jpg';
import sofaTerracottaImg from '@/assets/products/sofa-terracotta.jpg';
import bedKingImg from '@/assets/products/bed-king.jpg';
import wardrobeImg from '@/assets/products/wardrobe.jpg';
import officeChairImg from '@/assets/products/office-chair.jpg';
import armchairGreenImg from '@/assets/products/armchair-green.jpg';
import tvUnitImg from '@/assets/products/tv-unit.jpg';
import bookshelfImg from '@/assets/products/bookshelf.jpg';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  material: string;
  roomType: string;
  images: string[];
  description: string;
  specifications: {
    dimensions: string;
    weight: string;
    material: string;
    color: string;
    warranty: string;
  };
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Nordic Oak Dining Set',
    slug: 'nordic-oak-dining-set',
    price: 89999,
    originalPrice: 109999,
    category: 'Dining',
    subcategory: 'Dining Tables',
    material: 'Solid Oak Wood',
    roomType: 'Dining Room',
    images: [diningTableImg],
    description: 'Elegant 6-seater dining set crafted from premium solid oak wood. Features clean Scandinavian lines with comfortable upholstered chairs.',
    specifications: {
      dimensions: 'Table: 180cm x 90cm x 76cm, Chair: 45cm x 50cm x 90cm',
      weight: '95 kg (set)',
      material: 'Solid Oak Wood with Linen Upholstery',
      color: 'Natural Oak',
      warranty: '5 Years',
    },
    inStock: true,
    stockQuantity: 12,
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Terracotta Modern Sofa',
    slug: 'terracotta-modern-sofa',
    price: 64999,
    originalPrice: 79999,
    category: 'Sofas',
    subcategory: '3-Seater Sofas',
    material: 'Premium Fabric',
    roomType: 'Living Room',
    images: [sofaTerracottaImg],
    description: 'Statement piece in rich terracotta. This mid-century modern sofa combines comfort with bold design, featuring solid walnut legs and high-density foam cushions.',
    specifications: {
      dimensions: '210cm x 88cm x 82cm',
      weight: '62 kg',
      material: 'Cotton-Linen Blend Upholstery, Walnut Legs',
      color: 'Terracotta',
      warranty: '3 Years',
    },
    inStock: true,
    stockQuantity: 8,
    rating: 4.9,
    reviewCount: 243,
    isFeatured: true,
    isNew: true,
  },
  {
    id: '3',
    name: 'Haven King Bed Frame',
    slug: 'haven-king-bed-frame',
    price: 55999,
    category: 'Beds',
    subcategory: 'King Beds',
    material: 'Sheesham Wood',
    roomType: 'Bedroom',
    images: [bedKingImg],
    description: 'Luxurious king-size bed with a plush upholstered headboard. Crafted from premium sheesham wood with a natural finish that ages beautifully.',
    specifications: {
      dimensions: '195cm x 215cm x 110cm',
      weight: '85 kg',
      material: 'Sheesham Wood, Cotton Upholstery',
      color: 'Natural with Cream Headboard',
      warranty: '10 Years',
    },
    inStock: true,
    stockQuantity: 5,
    rating: 4.7,
    reviewCount: 89,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Classic Walnut Wardrobe',
    slug: 'classic-walnut-wardrobe',
    price: 78999,
    originalPrice: 95999,
    category: 'Storage',
    subcategory: 'Wardrobes',
    material: 'Walnut Wood',
    roomType: 'Bedroom',
    images: [wardrobeImg],
    description: 'Spacious 2-door wardrobe with stunning walnut veneer finish. Features multiple compartments, adjustable shelves, and soft-close hinges.',
    specifications: {
      dimensions: '120cm x 60cm x 200cm',
      weight: '110 kg',
      material: 'Walnut Veneer on Engineered Wood',
      color: 'Walnut Brown',
      warranty: '5 Years',
    },
    inStock: true,
    stockQuantity: 15,
    rating: 4.6,
    reviewCount: 67,
    isBestseller: true,
  },
  {
    id: '5',
    name: 'Ergo Pro Office Chair',
    slug: 'ergo-pro-office-chair',
    price: 24999,
    category: 'Office',
    subcategory: 'Office Chairs',
    material: 'Mesh & Metal',
    roomType: 'Office',
    images: [officeChairImg],
    description: 'Premium ergonomic office chair with adjustable lumbar support, 4D armrests, and breathable mesh back. Perfect for long work hours.',
    specifications: {
      dimensions: '70cm x 70cm x 120-130cm',
      weight: '18 kg',
      material: 'Breathable Mesh, Aluminum Base',
      color: 'Charcoal Grey',
      warranty: '3 Years',
    },
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviewCount: 312,
    isNew: true,
  },
  {
    id: '6',
    name: 'Velvet Accent Armchair',
    slug: 'velvet-accent-armchair',
    price: 32999,
    category: 'Chairs',
    subcategory: 'Accent Chairs',
    material: 'Velvet',
    roomType: 'Living Room',
    images: [armchairGreenImg],
    description: 'Stunning olive green velvet armchair that adds a touch of sophistication to any space. Features solid oak legs and comfortable foam padding.',
    specifications: {
      dimensions: '75cm x 80cm x 85cm',
      weight: '22 kg',
      material: 'Velvet Upholstery, Oak Legs',
      color: 'Olive Green',
      warranty: '2 Years',
    },
    inStock: true,
    stockQuantity: 18,
    rating: 4.5,
    reviewCount: 45,
    isFeatured: true,
  },
  {
    id: '7',
    name: 'Modern Entertainment Unit',
    slug: 'modern-entertainment-unit',
    price: 42999,
    originalPrice: 49999,
    category: 'Storage',
    subcategory: 'TV Units',
    material: 'Engineered Wood',
    roomType: 'Living Room',
    images: [tvUnitImg],
    description: 'Contemporary entertainment center with ample storage. Features cable management system, adjustable shelves, and sleek metal accents.',
    specifications: {
      dimensions: '180cm x 45cm x 180cm',
      weight: '75 kg',
      material: 'Engineered Wood with Metal Accents',
      color: 'Walnut',
      warranty: '3 Years',
    },
    inStock: true,
    stockQuantity: 10,
    rating: 4.7,
    reviewCount: 78,
  },
  {
    id: '8',
    name: 'Minimalist Bookshelf',
    slug: 'minimalist-bookshelf',
    price: 28999,
    category: 'Storage',
    subcategory: 'Bookshelves',
    material: 'Oak Wood',
    roomType: 'Study',
    images: [bookshelfImg],
    description: 'Clean-lined bookshelf with asymmetric compartments. Made from solid oak with a natural finish that complements any interior.',
    specifications: {
      dimensions: '100cm x 35cm x 180cm',
      weight: '45 kg',
      material: 'Solid Oak Wood',
      color: 'Natural Oak',
      warranty: '5 Years',
    },
    inStock: true,
    stockQuantity: 20,
    rating: 4.6,
    reviewCount: 56,
    isNew: true,
  },
];

export const categories = [
  { id: 'sofas', name: 'Sofas', count: 24 },
  { id: 'beds', name: 'Beds', count: 18 },
  { id: 'dining', name: 'Dining', count: 15 },
  { id: 'chairs', name: 'Chairs', count: 32 },
  { id: 'storage', name: 'Storage', count: 28 },
  { id: 'office', name: 'Office', count: 12 },
];

export const materials = [
  'Solid Wood',
  'Engineered Wood',
  'Metal',
  'Fabric',
  'Leather',
  'Velvet',
  'Mesh',
];

export const roomTypes = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Office',
  'Study',
  'Kids Room',
];

export const priceRanges = [
  { label: 'Under ₹25,000', min: 0, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getNewArrivals = () => products.filter(p => p.isNew);
export const getBestsellers = () => products.filter(p => p.isBestseller);
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getProductById = (id: string) => products.find(p => p.id === id);
