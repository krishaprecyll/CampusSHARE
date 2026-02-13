/*
  # Seed Initial Data and Add Delete Policies

  ## Overview
  This migration adds initial data for safe zones and necessary delete policies
  for admin operations.

  ## New Data
  1. **Safe Zones** - Three campus safe zones for item exchanges

  ## New Policies
  1. **Admins can delete items** - Allows admins to remove inappropriate items
  2. **Admins can delete rentals** - Allows admins to cancel problematic rentals

  ## Security
  - Delete policies only apply to users with role='admin'
  - All deletions maintain audit trail through CASCADE rules
  - Critical data maintains referential integrity

  ## Important Notes
  - Safe zones are set to active by default
  - Admin must exist before applying admin-only operations
  - Uses ON CONFLICT to prevent duplicate data on re-run
*/

-- Add safe zones
INSERT INTO safe_zones (name, location_description, latitude, longitude, active)
VALUES 
  ('Student Union', 'Main lobby, near information desk', 14.5995, 120.9842, true),
  ('Library Entrance', 'Main entrance, security desk area', 14.6000, 120.9850, true),
  ('Recreation Center', 'Front desk, monitored area', 14.5990, 120.9835, true)
ON CONFLICT DO NOTHING;

-- Admin delete policies for items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'items' AND policyname = 'Admins can delete items'
  ) THEN
    CREATE POLICY "Admins can delete items"
      ON items FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      );
  END IF;
END $$;

-- Admin delete policies for rentals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'rentals' AND policyname = 'Admins can delete rentals'
  ) THEN
    CREATE POLICY "Admins can delete rentals"
      ON rentals FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      );
  END IF;
END $$;
