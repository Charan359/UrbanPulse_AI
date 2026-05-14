-- ╔══════════════════════════════════════════════════════╗
-- ║           UrbanPulse AI — Database Schema            ║
-- ║    Run this in Supabase SQL Editor (Dashboard > SQL)  ║
-- ╚══════════════════════════════════════════════════════╝

-- ──────────────────────────────────────────────
-- 1. User Profiles
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT,
  gender        TEXT CHECK (gender IN ('Male', 'Female', 'Prefer not to say')),
  is_visually_impaired BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email, gender, is_visually_impaired)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'gender', 'Prefer not to say'),
    COALESCE((NEW.raw_user_meta_data->>'is_visually_impaired')::boolean, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    gender = EXCLUDED.gender,
    is_visually_impaired = EXCLUDED.is_visually_impaired,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ──────────────────────────────────────────────
-- 2. Saved Routes
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_routes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  origin_name      TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  route_type       TEXT NOT NULL,
  saved_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE saved_routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own routes" ON saved_routes;
CREATE POLICY "Users can manage own routes"
  ON saved_routes FOR ALL
  USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- 3. Citizen Reports
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS citizen_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category    TEXT NOT NULL CHECK (category IN ('safety', 'infrastructure', 'pollution', 'other')),
  description TEXT NOT NULL,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  status      TEXT DEFAULT 'pending',
  reported_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert reports" ON citizen_reports;
CREATE POLICY "Users can insert reports"
  ON citizen_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view reports" ON citizen_reports;
CREATE POLICY "Anyone can view reports"
  ON citizen_reports FOR SELECT
  USING (true);
