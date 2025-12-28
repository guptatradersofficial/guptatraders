-- Add social media link settings
INSERT INTO public.store_settings (key, value, type) VALUES 
  ('facebook_url', '', 'text'),
  ('instagram_url', '', 'text'),
  ('twitter_url', '', 'text')
ON CONFLICT (key) DO NOTHING;