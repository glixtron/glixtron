# 🔧 Fix Supabase Setup - "Table not found" Error

## 🚨 Problem
You're getting this error during registration:
```
Profile error: Could not find the table 'public.users' in the schema cache
```

## ✅ Solution: Create Database Tables

### **Step 1: Go to Supabase Dashboard**
1. Open [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)

### **Step 2: Open SQL Editor**
1. In your project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### **Step 3: Run Setup Script**
1. Copy the entire content of `scripts/setup-supabase.sql`
2. Paste it into the SQL editor
3. Click **"Run"** button (or press Ctrl+Enter)

### **Step 4: Verify Setup**
1. After running the script, you should see "✅ Success" messages
2. The following tables will be created:
   - `users` - User profiles and authentication
   - `user_profiles` - Extended profile information
   - `assessments` - User assessment data
   - `email_verifications` - Email verification tracking

### **Step 5: Test the Fix**
1. Go back to your app
2. Try registering a new user
3. The error should be resolved

## 🔍 Quick Test

You can test if the setup worked by visiting:
```
http://localhost:3000/api/test/supabase-setup
```

This will show you:
- ✅ Connection status
- ✅ Table existence
- ✅ Any remaining issues

## 📋 What the Setup Script Does

### **Database Tables Created:**
```sql
-- Main users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
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

-- Extended profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
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

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  assessment_type TEXT NOT NULL,
  assessment_data JSONB NOT NULL,
  results JSONB NOT NULL,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email verifications
CREATE TABLE email_verifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Security Features:**
- ✅ Row Level Security (RLS) enabled
- ✅ Proper access policies
- ✅ Automatic timestamp updates
- ✅ Indexes for performance
- ✅ Foreign key constraints

## 🚀 After Setup

Once you've run the SQL script:

### **1. Test Registration:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123456!"}'
```

### **2. Test Email Verification:**
```bash
curl -X POST http://localhost:3000/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### **3. Check Database:**
Visit: `http://localhost:3000/api/test/supabase-setup`

## 🔧 Troubleshooting

### **If you still get errors:**

1. **Check Supabase Project Status**
   - Make sure your project is active
   - Check if you're using the correct project URL

2. **Verify Environment Variables**
   ```bash
   # Check if these are set correctly
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run SQL Script Again**
   - Sometimes tables need to be recreated
   - Make sure the script completes successfully

4. **Check Supabase Logs**
   - Go to Database → Logs in Supabase dashboard
   - Look for any error messages

### **Common Issues:**

| Error | Solution |
|-------|----------|
| "Project not found" | Check SUPABASE_URL in environment |
| "Invalid API key" | Check SUPABASE_ANON_KEY |
| "Permission denied" | Run SQL script with proper permissions |
| "Table already exists" | That's fine! Tables are already created |

## 📞 Need Help?

If you're still having issues:

1. **Check the test endpoint**: `/api/test/supabase-setup`
2. **Review the SQL script**: `scripts/setup-supabase.sql`
3. **Verify environment variables**: Check `.env.local`
4. **Check Supabase dashboard**: Make sure project is active

---

**🎉 After running the SQL setup script, your registration should work perfectly with real Supabase database storage!**
