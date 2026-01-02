import { useEffect } from 'react';
import { useStoreSettings } from './useStoreSettings';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article' | 'category';
  category?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  alternateLanguages?: Array<{ hrefLang: string; href: string }>;
  product?: {
    name: string;
    price: number;
    currency?: string;
    availability?: 'in stock' | 'out of stock' | 'preorder';
    condition?: 'new' | 'used' | 'refurbished';
    brand?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
    images?: string[];
  };
}

export const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://www.guptatraders.net';
export const DEFAULT_TITLE = 'Gupta Traders - Premium Furniture Store | Quality Home & Office Furniture';
export const DEFAULT_DESCRIPTION = 'Shop premium quality furniture at Gupta Traders. Discover sofas, beds, dining tables, office chairs & more. Free delivery, 5-year warranty, easy returns. India\'s trusted furniture destination.';
export const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
export const DEFAULT_KEYWORDS = 'furniture, home furniture, office furniture, sofa, bed, dining table, wardrobe, chairs, furniture store, buy furniture online, premium furniture India, wooden furniture, modern furniture, traditional furniture';

export function useSEO(seoData?: SEOData) {
  const { data: storeSettings } = useStoreSettings();
  const storeName = storeSettings?.store_name || 'Gupta Traders';

  useEffect(() => {
    if (!seoData) {
      // Set default SEO
      updateMetaTags({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: BASE_URL,
        type: 'website',
        keywords: DEFAULT_KEYWORDS,
      });
      return;
    }

    const title = seoData.title 
      ? `${seoData.title} | ${storeName}`
      : DEFAULT_TITLE;
    
    const description = seoData.description || DEFAULT_DESCRIPTION;
    const image = seoData.image || DEFAULT_IMAGE;
    const url = seoData.url || BASE_URL;
    const type = seoData.type || 'website';
    const keywords = seoData.keywords || DEFAULT_KEYWORDS;

    updateMetaTags({
      title,
      description,
      image,
      url,
      type,
      keywords,
      product: seoData.product,
      author: seoData.author,
      publishedDate: seoData.publishedDate,
      modifiedDate: seoData.modifiedDate,
      alternateLanguages: seoData.alternateLanguages,
    });
  }, [seoData, storeName]);
}

function updateMetaTags(data: {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  keywords?: string;
  product?: SEOData['product'];
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  alternateLanguages?: Array<{ hrefLang: string; href: string }>;
}) {
  // Primary Meta Tags
  document.title = data.title;
  updateMetaTag('name', 'title', data.title);
  updateMetaTag('name', 'description', data.description);
  if (data.keywords) {
    updateMetaTag('name', 'keywords', data.keywords);
  }
  updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');
  updateMetaTag('name', 'theme-color', '#ffffff');
  updateMetaTag('property', 'og:url', data.url);
  updateMetaTag('rel', 'canonical', data.url);

  // Open Graph / Facebook
  updateMetaTag('property', 'og:type', data.type);
  updateMetaTag('property', 'og:title', data.title);
  updateMetaTag('property', 'og:description', data.description);
  updateMetaTag('property', 'og:image', data.image);
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '630');
  updateMetaTag('property', 'og:site_name', 'Gupta Traders');
  updateMetaTag('property', 'og:locale', 'en_IN');

  // Twitter
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:url', data.url);
  updateMetaTag('name', 'twitter:title', data.title);
  updateMetaTag('name', 'twitter:description', data.description);
  updateMetaTag('name', 'twitter:image', data.image);
  updateMetaTag('name', 'twitter:creator', '@guptatraders');

  // Article meta tags
  if (data.publishedDate) {
    updateMetaTag('property', 'article:published_time', data.publishedDate);
  }
  if (data.modifiedDate) {
    updateMetaTag('property', 'article:modified_time', data.modifiedDate);
  }
  if (data.author) {
    updateMetaTag('property', 'article:author', data.author);
  }

  // Alternate language links
  if (data.alternateLanguages && data.alternateLanguages.length > 0) {
    // Remove old alternate links
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
    
    // Add new alternate links
    data.alternateLanguages.forEach(alt => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hrefLang = alt.hrefLang;
      link.href = alt.href;
      document.head.appendChild(link);
    });
  }

  // Product-specific meta tags
  if (data.type === 'product' && data.product) {
    updateMetaTag('property', 'product:price:amount', data.product.price.toString());
    updateMetaTag('property', 'product:price:currency', data.product.currency || 'INR');
    updateMetaTag('property', 'product:availability', data.product.availability || 'in stock');
    updateMetaTag('property', 'product:condition', data.product.condition || 'new');
    if (data.product.brand) {
      updateMetaTag('property', 'product:brand', data.product.brand);
    }
    if (data.product.category) {
      updateMetaTag('property', 'product:category', data.product.category);
    }
  }
}

export function generateProductStructuredData(product: any) {
  const image = product.images?.[0]?.image_url || `${BASE_URL}/placeholder.svg`;
  const availability = product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  
  const offers = [];
  
  // Primary offer
  const mainOffer: Record<string, any> = {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'INR',
    availability: availability,
    url: `${BASE_URL}/product/${product.slug}`,
    seller: {
      '@type': 'Organization',
      name: 'Gupta Traders',
    },
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
  };

  if (product.compare_at_price && product.compare_at_price > product.price) {
    mainOffer.priceCurrency = 'INR';
    mainOffer.priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  offers.push(mainOffer);

  const additionalProperties: Record<string, any>[] = [];
  
  if (product.material) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'Material',
      value: product.material,
    });
  }

  // Add color, size, or other standard properties if available
  additionalProperties.push({
    '@type': 'PropertyValue',
    name: 'Product Type',
    value: product.category?.name || 'Furniture',
  });

  const structuredData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - Premium furniture from Gupta Traders`,
    image: product.images?.map(img => img.image_url) || [image],
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Gupta Traders',
      url: BASE_URL,
    },
    category: product.category?.name || 'Furniture',
    url: `${BASE_URL}/product/${product.slug}`,
    offers: offers.length === 1 ? offers[0] : offers,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating?.toString() || '4.5',
      reviewCount: product.reviewCount?.toString() || '0',
    },
    additionalProperty: additionalProperties,
  };

  return structuredData;
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    '@id': `${BASE_URL}/#organization`,
    name: 'Gupta Traders',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: 'https://storage.googleapis.com/gpt-engineer-file-uploads/ks2LU650qpalCsuylwKQ8Z02bzl1/uploads/1766227901094-Gemini_Generated_Image_3zvn2e3zvn2e3zvn-removebg-preview.png',
      width: 250,
      height: 60,
    },
    description: 'Premium quality furniture store offering sofas, beds, dining tables, office furniture and more with free delivery and 5-year warranty.',
    sameAs: [
      'https://www.facebook.com/guptatraders',
      'https://www.instagram.com/guptatraders',
      'https://twitter.com/guptatraders',
      'https://www.youtube.com/guptatraders',
    ],
    priceRange: '₹₹',
    areaServed: {
      '@type': 'Country',
      name: 'IN',
    },
    contactPoint: {
      '@type': 'CustomerService',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'Customer Service',
      email: 'support@guptatraders.net',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Gupta Traders',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    isPartOf: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#business`,
    name: 'Gupta Traders',
    url: BASE_URL,
    image: 'https://storage.googleapis.com/gpt-engineer-file-uploads/ks2LU650qpalCsuylwKQ8Z02bzl1/uploads/1766227901094-Gemini_Generated_Image_3zvn2e3zvn2e3zvn-removebg-preview.png',
    description: 'Premium furniture store in India with quality sofas, beds, dining tables, and office furniture.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    priceRange: '₹₹',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '20:00',
    },
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

