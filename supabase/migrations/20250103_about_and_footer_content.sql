-- Create about_content table for editable about page content
CREATE TABLE IF NOT EXISTS public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text,
  content text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read about content" ON public.about_content;
DROP POLICY IF EXISTS "Admins can manage about content" ON public.about_content;

-- Anyone can read about content
CREATE POLICY "Anyone can read about content"
ON public.about_content
FOR SELECT
USING (true);

-- Only authenticated users can manage about content
CREATE POLICY "Admins can manage about content"
ON public.about_content
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_about_content_updated_at ON public.about_content;

CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default about content if not exists
INSERT INTO public.about_content (section_key, title, content, sort_order) 
VALUES 
  ('hero_title', 'Crafting Beautiful Spaces Since 1961', NULL, 1),
  ('hero_subtitle', 'At Gupta Traders, we believe that furniture is more than just functional pieces—it''s an expression of your personality and a foundation for cherished memories.', NULL, 2),
  ('story_title', 'A Legacy of Quality & Trust', NULL, 3),
  ('story_content', 'What started as a small workshop in 1961 has grown into one of the most trusted furniture brands in India. Our founder, Rajesh Gupta, began with a simple vision: to create furniture that combines timeless design with exceptional durability.

Over the decades, we''ve stayed true to this vision while embracing innovation. Today, we blend traditional craftsmanship with modern manufacturing techniques to deliver furniture that meets the highest standards of quality.

From our state-of-the-art manufacturing facility, we create pieces that transform houses into homes. Every sofa, bed, and dining set that leaves our workshop carries with it our commitment to excellence.', NULL, 4),
  ('owner_name', 'Rajesh Gupta', NULL, 5),
  ('owner_title', 'Founder & Managing Director', NULL, 6),
  ('owner_quote', '"Quality is never an accident. It''s the result of intelligent effort, sincere passion, and skillful execution. This philosophy has guided us for over six decades, and it remains at the heart of everything we do."', NULL, 7),
  ('owner_image', NULL, NULL, 8),
  ('showroom_title', 'Our Showroom', NULL, 9),
  ('showroom_subtitle', 'Experience our furniture collection in person at our flagship showroom in Delhi.', NULL, 10),
  ('showroom_main', NULL, NULL, 11),
  ('showroom_image_1', NULL, NULL, 12),
  ('showroom_image_2', NULL, NULL, 13),
  ('showroom_image_3', NULL, NULL, 14),
  ('showroom_image_4', NULL, NULL, 15),
  ('stat_years', '60+', 'Years of Excellence', 16),
  ('stat_customers', '100K+', 'Happy Customers', 17),
  ('stat_products', '200K+', 'Products Delivered', 18),
  ('stat_cities', '50+', 'Cities Served', 19)
ON CONFLICT (section_key) DO NOTHING;

-- Ensure footer_items table exists with proper structure
CREATE TABLE IF NOT EXISTS public.footer_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for footer_items
ALTER TABLE public.footer_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read footer items" ON public.footer_items;
DROP POLICY IF EXISTS "Admins can manage footer items" ON public.footer_items;

-- Anyone can read footer items
CREATE POLICY "Anyone can read footer items"
ON public.footer_items
FOR SELECT
USING (true);

-- Only authenticated users can manage footer items
CREATE POLICY "Admins can manage footer items"
ON public.footer_items
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Drop trigger if exists and recreate for footer_items
DROP TRIGGER IF EXISTS update_footer_items_updated_at ON public.footer_items;

CREATE TRIGGER update_footer_items_updated_at
BEFORE UPDATE ON public.footer_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default footer items if not exists
INSERT INTO public.footer_items (section, title, url, sort_order, is_active)
VALUES
  ('quick_links', 'Home', '/', 1, true),
  ('quick_links', 'Products', '/products', 2, true),
  ('quick_links', 'About Us', '/about', 3, true),
  ('customer_service', 'Contact Us', '/contact', 1, true),
  ('customer_service', 'FAQs', '#', 2, true),
  ('customer_service', 'Shipping & Delivery', '#', 3, true),
  ('about', 'About Gupta Traders', '/about', 1, true),
  ('about', 'Our Story', '#', 2, true),
  ('legal', 'Privacy Policy', '#', 1, true),
  ('legal', 'Terms of Service', '#', 2, true),
  ('legal', 'Return Policy', '#', 3, true)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON public.about_content TO authenticated;
GRANT ALL ON public.footer_items TO authenticated;
GRANT SELECT ON public.about_content TO anon;
GRANT SELECT ON public.footer_items TO anon;
