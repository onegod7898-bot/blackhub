-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Checkout sessions table
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  session_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);

-- Enable Row Level Security (RLS) - adjust policies based on your needs
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your authentication setup)
-- Allow public read access to products
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Allow authenticated users to insert products (adjust as needed)
CREATE POLICY "Allow authenticated insert on products" ON products
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own checkout sessions
CREATE POLICY "Users can read own checkout sessions" ON checkout_sessions
  FOR SELECT USING (true);

-- Allow users to insert their own checkout sessions
CREATE POLICY "Users can insert own checkout sessions" ON checkout_sessions
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own checkout sessions
CREATE POLICY "Users can update own checkout sessions" ON checkout_sessions
  FOR UPDATE USING (true);

-- Insert some example products (optional)
INSERT INTO products (name, description, price) VALUES
  ('Example Product 1', 'This is an example product description', 29.99),
  ('Example Product 2', 'Another example product for testing', 49.99),
  ('Example Product 3', 'Premium example product', 99.99)
ON CONFLICT DO NOTHING;
