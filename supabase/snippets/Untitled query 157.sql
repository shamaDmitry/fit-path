-- 1. Profiles: Extends Supabase Auth users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  is_subscriber BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  quiz_results JSONB -- Stores weight, goals, etc.
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can only see their own data
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);