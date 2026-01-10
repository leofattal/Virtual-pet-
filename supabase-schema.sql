-- PixelPal - Supabase Database Schema
-- Paste this SQL into your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet data table - stores pet stats and info
CREATE TABLE IF NOT EXISTS public.pet_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pet_name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    hunger INTEGER DEFAULT 80,
    energy INTEGER DEFAULT 80,
    happiness INTEGER DEFAULT 80,
    cleanliness INTEGER DEFAULT 80,
    is_dead BOOLEAN DEFAULT FALSE,
    current_hat TEXT,
    current_accessory TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Inventory table - stores coins and items
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    coins INTEGER DEFAULT 100,
    items JSONB DEFAULT '{}'::jsonb,
    owned_clothes TEXT[] DEFAULT ARRAY[]::TEXT[],
    owned_toys TEXT[] DEFAULT ARRAY[]::TEXT[],
    owned_house_items TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Game scores table - stores high scores and games played
CREATE TABLE IF NOT EXISTS public.game_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_high_scores JSONB DEFAULT '{}'::jsonb,
    total_games_played INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_pet_data_user_id ON public.pet_data(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON public.game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Pet data policies
CREATE POLICY "Users can view own pet data"
    ON public.pet_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pet data"
    ON public.pet_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pet data"
    ON public.pet_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pet data"
    ON public.pet_data FOR DELETE
    USING (auth.uid() = user_id);

-- Inventory policies
CREATE POLICY "Users can view own inventory"
    ON public.inventory FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
    ON public.inventory FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
    ON public.inventory FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
    ON public.inventory FOR DELETE
    USING (auth.uid() = user_id);

-- Game scores policies
CREATE POLICY "Users can view own game scores"
    ON public.game_scores FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game scores"
    ON public.game_scores FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game scores"
    ON public.game_scores FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own game scores"
    ON public.game_scores FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS for updated_at timestamps
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for each table
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_pet_data
    BEFORE UPDATE ON public.pet_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_inventory
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_game_scores
    BEFORE UPDATE ON public.game_scores
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- FUNCTION to create user profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- HELPFUL QUERIES (commented out - for reference)
-- ============================================================

-- Get all data for a user:
-- SELECT
--   p.*,
--   pd.*,
--   i.*,
--   gs.*
-- FROM profiles p
-- LEFT JOIN pet_data pd ON p.id = pd.user_id
-- LEFT JOIN inventory i ON p.id = i.user_id
-- LEFT JOIN game_scores gs ON p.id = gs.user_id
-- WHERE p.id = auth.uid();

-- Initialize new user data (run after signup):
-- INSERT INTO pet_data (user_id, pet_name) VALUES (auth.uid(), 'New Pet');
-- INSERT INTO inventory (user_id) VALUES (auth.uid());
-- INSERT INTO game_scores (user_id) VALUES (auth.uid());
