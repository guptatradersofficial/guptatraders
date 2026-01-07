-- Add showroom contact info to about_content table

-- Insert showroom address
INSERT INTO public.about_content (section_key, title, content, sort_order, is_active)
VALUES (
  'showroom_address',
  'Address',
  'Infront of Ram Janki mandir, mahadeva road, ara. 802301',
  15,
  true
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- Insert showroom phone
INSERT INTO public.about_content (section_key, title, content, sort_order, is_active)
VALUES (
  'showroom_phone',
  'Phone',
  '+91 9470071791',
  16,
  true
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- Insert showroom email
INSERT INTO public.about_content (section_key, title, content, sort_order, is_active)
VALUES (
  'showroom_email',
  'Email',
  'guptatradersofficials@gmail.com',
  17,
  true
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- Insert showroom weekday hours
INSERT INTO public.about_content (section_key, title, content, sort_order, is_active)
VALUES (
  'showroom_hours_weekday',
  'Working Hours (Weekday)',
  'Mon - Sat: 9:00 AM - 8:00 PM',
  18,
  true
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- Insert showroom weekend hours
INSERT INTO public.about_content (section_key, title, content, sort_order, is_active)
VALUES (
  'showroom_hours_weekend',
  'Working Hours (Weekend)',
  'Sun: 9:00 AM - 8:00 PM',
  19,
  true
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;
