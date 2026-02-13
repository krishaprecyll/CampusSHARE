/*
  # Add User Profile Fields for Delivery and Identification

  ## Overview
  This migration extends the users table with additional fields necessary for
  rental operations, delivery coordination, and user identification.

  ## New Columns Added to users table
  1. **address** (text) - User's primary delivery/contact address
  2. **campus_building** (text) - Preferred campus building for pickups
  3. **profile_picture_url** (text) - URL to user's profile picture
  4. **emergency_contact_name** (text) - Emergency contact person name
  5. **emergency_contact_phone** (text) - Emergency contact phone number
  6. **id_verification_status** (text) - Status of ID verification (pending/verified/rejected)
  7. **bio** (text) - Short user biography/description

  ## Security
  - No changes to RLS policies required
  - Existing policies already cover these new fields
  - Users can update their own profile information

  ## Important Notes
  - All new fields are optional to allow gradual profile completion
  - Default values are provided where appropriate
  - ID verification status defaults to 'pending'
*/

-- Add new columns to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'address'
  ) THEN
    ALTER TABLE users ADD COLUMN address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'campus_building'
  ) THEN
    ALTER TABLE users ADD COLUMN campus_building text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_picture_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'emergency_contact_name'
  ) THEN
    ALTER TABLE users ADD COLUMN emergency_contact_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'emergency_contact_phone'
  ) THEN
    ALTER TABLE users ADD COLUMN emergency_contact_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'id_verification_status'
  ) THEN
    ALTER TABLE users ADD COLUMN id_verification_status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio text;
  END IF;
END $$;
