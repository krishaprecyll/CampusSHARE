/*
  # University Rental Platform Database Schema

  ## Overview
  This migration creates a complete database schema for a university-based rental/sharing platform
  where students can rent items from each other with safe zone delivery locations.

  ## New Tables

  ### 1. users
  - `id` (uuid, primary key) - Unique user identifier
  - `university_id` (text, unique) - University student ID
  - `email` (text, unique) - User email address
  - `password_hash` (text) - Hashed password
  - `full_name` (text) - User's full name
  - `role` (enum) - User role: student, staff, admin
  - `phone` (text) - Contact phone number
  - `verified` (boolean) - Email/account verification status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. items
  - `id` (uuid, primary key) - Unique item identifier
  - `name` (text) - Item name
  - `description` (text) - Detailed description
  - `category` (text) - Item category
  - `image_url` (text) - Image URL
  - `condition` (text) - Item condition
  - `available` (boolean) - Availability status
  - `rental_fee` (decimal) - Rental price
  - `rental_duration_days` (integer) - Rental duration
  - `deposit_amount` (decimal) - Security deposit
  - `created_at` (timestamptz) - Item creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `owner_id` (uuid, foreign key) - References users

  ### 3. safe_zones
  - `id` (uuid, primary key) - Unique safe zone identifier
  - `name` (text) - Location name
  - `location_description` (text) - Detailed location description
  - `latitude` (decimal) - GPS latitude
  - `longitude` (decimal) - GPS longitude
  - `active` (boolean) - Active status

  ### 4. rentals
  - `id` (uuid, primary key) - Unique rental identifier
  - `delivery_id` (uuid, foreign key) - References deliveries
  - `item_id` (uuid, foreign key) - References items
  - `start_date` (date) - Rental start date
  - `end_date` (date) - Rental end date
  - `status` (enum) - Rental status
  - `created_at` (timestamptz) - Rental creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `renter_id` (uuid, foreign key) - References users

  ### 5. deliveries
  - `id` (uuid, primary key) - Unique delivery identifier
  - `safe_zone_id` (uuid, foreign key) - References safe_zones
  - `scheduled_time` (timestamptz) - Scheduled delivery time
  - `delivered_at` (timestamptz) - Actual delivery timestamp
  - `status` (enum) - Delivery status
  - `verification_code` (text) - Verification code
  - `rental_id` (uuid, foreign key) - References rentals
  - `delivery_staff_id` (uuid, foreign key) - References users

  ### 6. transactions
  - `id` (uuid, primary key) - Unique transaction identifier
  - `rental_id` (uuid, foreign key) - References rentals
  - `payer_id` (uuid, foreign key) - References users (payer)
  - `payee_id` (uuid, foreign key) - References users (payee)
  - `amount` (decimal) - Transaction amount
  - `transaction_type` (enum) - Type of transaction
  - `payment_method` (enum) - Payment method used
  - `status` (enum) - Transaction status
  - `created_at` (timestamptz) - Transaction timestamp

  ### 7. trust_safety
  - `id` (uuid, primary key) - Unique record identifier
  - `user_id` (uuid, foreign key) - References users
  - `rating` (decimal) - User trust rating
  - `report_count` (integer) - Number of reports
  - `last_reported_at` (timestamptz) - Last report timestamp
  - `notes` (text) - Safety notes

  ### 8. analytics
  - `id` (uuid, primary key) - Unique analytics identifier
  - `metric_name` (text) - Name of the metric
  - `metric_value` (decimal) - Value of the metric
  - `recorded_at` (timestamptz) - Recording timestamp

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
  - Public read access for items and safe zones
  - Restricted access for sensitive data
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin');
CREATE TYPE rental_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('scheduled', 'in_transit', 'delivered', 'failed');
CREATE TYPE transaction_type AS ENUM ('rental_payment', 'deposit', 'refund', 'fee');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'university_account', 'cash');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'student',
  phone text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create safe_zones table
CREATE TABLE IF NOT EXISTS safe_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location_description text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  active boolean DEFAULT true
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  image_url text,
  condition text DEFAULT 'good',
  available boolean DEFAULT true,
  rental_fee decimal(10, 2) NOT NULL,
  rental_duration_days integer DEFAULT 1,
  deposit_amount decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status rental_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  renter_id uuid REFERENCES users(id) ON DELETE CASCADE,
  delivery_id uuid
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  safe_zone_id uuid REFERENCES safe_zones(id) ON DELETE SET NULL,
  scheduled_time timestamptz NOT NULL,
  delivered_at timestamptz,
  status delivery_status DEFAULT 'scheduled',
  verification_code text,
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE,
  delivery_staff_id uuid REFERENCES users(id) ON DELETE SET NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE,
  payer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  payee_id uuid REFERENCES users(id) ON DELETE SET NULL,
  amount decimal(10, 2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  payment_method payment_method NOT NULL,
  status transaction_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create trust_safety table
CREATE TABLE IF NOT EXISTS trust_safety (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  rating decimal(3, 2) DEFAULT 5.00,
  report_count integer DEFAULT 0,
  last_reported_at timestamptz,
  notes text
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value decimal(10, 2) NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for items
CREATE POLICY "Anyone can view available items"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own items"
  ON items FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own items"
  ON items FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- RLS Policies for safe_zones
CREATE POLICY "Anyone can view active safe zones"
  ON safe_zones FOR SELECT
  TO authenticated
  USING (active = true);

-- RLS Policies for rentals
CREATE POLICY "Users can view their rentals"
  ON rentals FOR SELECT
  TO authenticated
  USING (
    auth.uid() = renter_id OR 
    EXISTS (SELECT 1 FROM items WHERE items.id = rentals.item_id AND items.owner_id = auth.uid())
  );

CREATE POLICY "Users can create rentals"
  ON rentals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update their rentals"
  ON rentals FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = renter_id OR 
    EXISTS (SELECT 1 FROM items WHERE items.id = rentals.item_id AND items.owner_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = renter_id OR 
    EXISTS (SELECT 1 FROM items WHERE items.id = rentals.item_id AND items.owner_id = auth.uid())
  );

-- RLS Policies for deliveries
CREATE POLICY "Users can view their deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rentals 
      WHERE rentals.id = deliveries.rental_id 
      AND (rentals.renter_id = auth.uid() OR EXISTS (SELECT 1 FROM items WHERE items.id = rentals.item_id AND items.owner_id = auth.uid()))
    )
  );

-- RLS Policies for transactions
CREATE POLICY "Users can view their transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- RLS Policies for trust_safety
CREATE POLICY "Users can view trust ratings"
  ON trust_safety FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own trust record"
  ON trust_safety FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for analytics (admin only in production)
CREATE POLICY "Authenticated users can view analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_owner ON items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_available ON items(available);
CREATE INDEX IF NOT EXISTS idx_rentals_renter ON rentals(renter_id);
CREATE INDEX IF NOT EXISTS idx_rentals_item ON rentals(item_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_rental ON deliveries(rental_id);
CREATE INDEX IF NOT EXISTS idx_transactions_rental ON transactions(rental_id);
CREATE INDEX IF NOT EXISTS idx_trust_safety_user ON trust_safety(user_id);