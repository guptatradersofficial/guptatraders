-- Add optional GST number field to orders table
ALTER TABLE public.orders ADD COLUMN customer_gst_number text;