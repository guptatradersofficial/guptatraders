/**
 * Sitemap Generator Script
 * Run this script to generate a sitemap.xml file
 * Usage: node scripts/generate-sitemap.js
 * 
 * Note: This requires Supabase credentials to fetch products and categories
 * For production, consider running this as a build step or scheduled job
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.VITE_SITE_URL || 'https://www.guptatraders.net';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateSitemap() {
  console.log('Generating sitemap...');

  const urls = [];

  // Static pages with priority and change frequency
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0', label: 'Homepage' },
    { loc: '/products', changefreq: 'daily', priority: '0.9', label: 'Products' },
    { loc: '/cart', changefreq: 'weekly', priority: '0.8', label: 'Cart' },
    { loc: '/wishlist', changefreq: 'weekly', priority: '0.7', label: 'Wishlist' },
    { loc: '/auth', changefreq: 'monthly', priority: '0.6', label: 'Authentication' },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${BASE_URL}${page.loc}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString().split('T')[0],
    });
    console.log(`✓ Added ${page.label}`);
  });

  try {
    // Fetch categories with improved error handling
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug, updated_at, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (catError) {
      console.warn('Warning: Could not fetch categories:', catError.message);
    } else if (categories && categories.length > 0) {
      categories.forEach(category => {
        urls.push({
          loc: `${BASE_URL}/products?category=${category.slug}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: category.updated_at ? new Date(category.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      });
      console.log(`✓ Added ${categories.length} categories`);
    }

    // Fetch products with images and improved structure
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, slug, updated_at, is_active, images:product_images(image_url, alt_text, is_primary)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (prodError) {
      console.warn('Warning: Could not fetch products:', prodError.message);
    } else if (products && products.length > 0) {
      products.forEach(product => {
        const urlEntry = {
          loc: `${BASE_URL}/product/${product.slug}`,
          changefreq: 'weekly',
          priority: '0.7',
          lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };

        // Add primary or first image if available
        if (product.images && product.images.length > 0) {
          const primaryImage = product.images.find((img) => img.is_primary);
          const imageUrl = primaryImage?.image_url || product.images[0]?.image_url;
          if (imageUrl) {
            urlEntry.image = imageUrl;
            urlEntry.imageAlt = primaryImage?.alt_text || product.images[0]?.alt_text;
          }
        }

        urls.push(urlEntry);
      });
      console.log(`✓ Added ${products.length} products`);
    }

    // Generate main sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>${url.image ? `
    <image:image>
      <image:loc>${escapeXml(url.image)}</image:loc>${url.imageAlt ? `
      <image:title>${escapeXml(url.imageAlt)}</image:title>` : ''}
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

    // Write to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap, 'utf8');

    console.log(`✅ Main sitemap generated successfully with ${urls.length} URLs`);
    console.log(`📄 Saved to: ${outputPath}`);

    // Generate sitemap index for better structure
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

    const sitemapIndexPath = path.join(__dirname, '..', 'public', 'sitemap-index.xml');
    fs.writeFileSync(sitemapIndexPath, sitemapIndex, 'utf8');
    console.log(`✅ Sitemap index generated`);
    console.log(`📄 Saved to: ${sitemapIndexPath}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

generateSitemap();
