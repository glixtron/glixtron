# 🚀 Supabase Setup Guide for Glixtron AI Career Platform

## 📋 Quick Setup Steps

### 1. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Sign in with your GitHub account
3. Create a new project or use existing one
4. Go to **Settings** → **API**
5. Copy these credentials:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Set Up Database Tables

Go to **SQL Editor** in your Supabase project and run this:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image TEXT,
  bio TEXT,
  location VARCHAR(255),
  phone VARCHAR(50),
  website TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{"theme": "dark", "notifications": true, "email_updates": true}'
);

-- Create assessment_data table
CREATE TABLE assessment_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  core_skills TEXT[],
  soft_skills TEXT[],
  remote_preference INTEGER DEFAULT 50,
  startup_preference INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resume_scans table
CREATE TABLE resume_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_text TEXT NOT NULL,
  jd_text TEXT NOT NULL,
  jd_link TEXT,
  analysis JSONB,
  match_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_data table
CREATE TABLE user_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  saved_resume_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_assessment_user_id ON assessment_data(user_id);
CREATE INDEX idx_resume_scans_user_id ON resume_scans(user_id);
CREATE INDEX idx_user_data_user_id ON user_data(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can view own assessment" ON assessment_data FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own assessment" ON assessment_data FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own resume scans" ON resume_scans FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own user data" ON user_data FOR ALL USING (auth.uid()::text = user_id::text);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_assessment_updated_at BEFORE UPDATE ON assessment_data FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_resume_scans_updated_at BEFORE UPDATE ON resume_scans FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_user_data_updated_at BEFORE UPDATE ON user_data FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

### 3. Set Environment Variables

Create a `.env.local` file in your project root:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Development
NODE_ENV=development
```

### 4. Update API Routes to Use Supabase

The code is already set up to use Supabase! Just need to update the imports.

### 5. Test the Connection

Run these commands to test:

```bash
# Install dependencies
npm install

# Test locally
npm run dev

# Test build
npm run build
```

## 🔧 Vercel Deployment Setup

### 1. Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

```
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://glixtron.vercel.app
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NODE_ENV=production
```

### 2. Deploy

Push your code to GitHub and Vercel will auto-deploy with Supabase connection!

## 🎯 What This Fixes

✅ **Persistent Data**: No more lost data on server restarts
✅ **Scalable**: Handles multiple users and large datasets
✅ **Secure**: Row Level Security protects user data
✅ **Fast**: Optimized queries and indexes
✅ **Real-time**: Built-in real-time capabilities

## 🚨 Important Notes

1. **Password Hashing**: Currently using plain text (for testing). Add bcrypt for production
2. **RLS Policies**: Users can only access their own data
3. **Environment Variables**: Never commit secrets to Git
4. **Backup**: Supabase provides automatic backups

## 📞 Support

If you need help:
1. Check Supabase documentation: https://supabase.com/docs
2. Check the console logs for errors
3. Verify environment variables are set correctly

---

**Ready to connect to Supabase!** 🚀

Once you complete these steps, your app will have a proper database that works on Vercel!
