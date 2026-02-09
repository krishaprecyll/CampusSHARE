/*
  # Add User Insert Policy

  ## Overview
  This migration adds RLS policies to allow users to insert their own profile
  during registration. This is necessary for the registration flow to work.

  ## New Policies
  1. **Users can insert own profile** - Allows authenticated users to create their
     own profile record during the registration process

  ## Security
  - Users can only insert a record with their own auth.uid()
  - This ensures users cannot create profiles for other users
  - The policy requires authentication

  ## Important Notes
  - This works in conjunction with Supabase Auth's user creation
  - The user_id must match the authenticated user's ID
*/

-- Add INSERT policy for users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'users' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON users FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
