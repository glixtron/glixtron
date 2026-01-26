-- Glixtron Supabase Database Setup
-- Copy this entire content and paste into Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  provider TEXT DEFAULT 'email',
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  website TEXT,
  social_links JSONB,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can insert their own profile (for OAuth)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Allow public registration (for signup)
CREATE POLICY "Enable public registration" ON users
  FOR INSERT WITH CHECK (true);

-- Create user_profiles table for extended profile information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_url TEXT,
  skills TEXT[],
  experience_years INTEGER,
  education JSONB,
  work_experience JSONB,
  projects JSONB,
  certifications JSONB,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_skills ON user_profiles USING GIN(skills);

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile details" ON user_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile details" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own profile details" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- 'skills', 'personality', 'career'
  assessment_data JSONB NOT NULL,
  results JSONB NOT NULL,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for assessments
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Enable RLS for assessments
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Policies for assessments
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create email_verifications table for manual email verification tracking
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email_verifications
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);

-- Enable RLS for email_verifications
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Policies for email_verifications
CREATE POLICY "Users can view own email verifications" ON email_verifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create function to clean up expired email verifications
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verifications WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON assessments TO authenticated;
GRANT ALL ON email_verifications TO authenticated;

-- Grant public access for registration
GRANT INSERT ON users TO anon;
GRANT SELECT ON users TO anon;

-- Create view for user profiles with joined data
CREATE OR REPLACE VIEW user_profile_summary AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.email_verified,
  u.provider,
  u.avatar_url,
  u.bio,
  u.location,
  u.created_at,
  up.resume_url,
  up.skills,
  up.experience_years,
  up.linkedin_url,
  up.github_url,
  up.portfolio_url
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id;

-- Grant access to the view
GRANT SELECT ON user_profile_summary TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Glixtron database setup completed successfully!';
  RAISE NOTICE 'Tables created: users, user_profiles, assessments, email_verifications';
  RAISE NOTICE 'RLS enabled with appropriate policies';
  RAISE NOTICE 'Indexes created for performance';
  RAISE NOTICE 'Triggers created for automatic timestamps';
END $$;
