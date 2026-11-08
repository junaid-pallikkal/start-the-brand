-- ==============================================================================
-- STARTTHEBRAND — SUPABASE POSTGRESQL INITIAL SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  brand_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PROJECTS TABLE (2D studio apparel designs & layer state)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  garment_id TEXT NOT NULL,
  garment_color TEXT NOT NULL,
  layers JSONB DEFAULT '{"FRONT":[],"BACK":[],"LEFT_SLEEVE":[],"RIGHT_SLEEVE":[]}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. MOCKUPS TABLE (3D snapshots and turntable capture records)
CREATE TABLE IF NOT EXISTS public.mockups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  garment_name TEXT NOT NULL,
  garment_color TEXT NOT NULL,
  camera_preset TEXT NOT NULL,
  environment_preset TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. PRODUCTS TABLE (SKU manager, size runs & unit margins)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sku TEXT NOT NULL,
  retail_price NUMERIC(10, 2) NOT NULL,
  blank_cost NUMERIC(10, 2) NOT NULL,
  print_cost NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL,
  profit_margin NUMERIC(5, 2) NOT NULL,
  sizes JSONB DEFAULT '[]'::jsonb NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. MARKETPLACE DROPS (Community apparel drops & showcases)
CREATE TABLE IF NOT EXISTS public.marketplace_drops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  garment_id TEXT NOT NULL,
  garment_color TEXT NOT NULL,
  layers JSONB DEFAULT '{}'::jsonb NOT NULL,
  thumbnail_url TEXT,
  price_usd NUMERIC(10, 2) NOT NULL,
  likes_count INT DEFAULT 0 NOT NULL,
  is_public BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mockups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_drops ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PROJECTS Policies
CREATE POLICY "Users can view their own projects" 
  ON public.projects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- MOCKUPS Policies
CREATE POLICY "Users can view their own mockups" 
  ON public.mockups FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mockups" 
  ON public.mockups FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mockups" 
  ON public.mockups FOR DELETE USING (auth.uid() = user_id);

-- PRODUCTS Policies
CREATE POLICY "Users can view their own products" 
  ON public.products FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" 
  ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
  ON public.products FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
  ON public.products FOR DELETE USING (auth.uid() = user_id);

-- MARKETPLACE DROPS Policies
CREATE POLICY "Public drops are viewable by everyone" 
  ON public.marketplace_drops FOR SELECT USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own drops" 
  ON public.marketplace_drops FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own drops" 
  ON public.marketplace_drops FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own drops" 
  ON public.marketplace_drops FOR DELETE USING (auth.uid() = creator_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, brand_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'brand_name', 'Independent Brand'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
