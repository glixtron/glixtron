# Supabase Migration Guide

This guide will help you migrate from the mock persistent database to Supabase for production deployment.

## 🚀 Migration Steps

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Create Database Schema

Run this SQL in your Supabase SQL Editor:

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

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
```

### 3. Set Environment Variables

Add these to your `.env.local` and Vercel environment variables:

```env
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://glixtron.vercel.app
```

### 4. Update Code for Supabase

#### Replace Database Functions

In your API routes, replace mock database imports:

```typescript
// Replace this:
import { findUserByEmail, createUser } from '@/lib/database-persistent'

// With this:
import { findUserByEmail, createUser } from '@/lib/supabase'
```

#### Update Auth Configuration

In `lib/auth-config.ts`, replace the mock functions:

```typescript
// Replace the authorize function with Supabase implementation
async authorize(credentials) {
  // Use SupabaseUserManager instead of mock database
  const user = await SupabaseUserManager.findUserByEmail(credentials.email)
  const isValid = await SupabaseUserManager.validatePassword(credentials.email, credentials.password)
  // ... rest of the logic
}
```

### 5. Install Dependencies

```bash
npm install @supabase/supabase-js bcrypt
```

### 6. Migrate Existing Data

If you have existing users in the mock database, you can migrate them:

```typescript
// Create a migration script
import { getAllUsers } from '@/lib/database-persistent'
import { createUser } from '@/lib/supabase'

async function migrateUsers() {
  const mockUsers = await getAllUsers()
  
  for (const user of mockUsers) {
    await createUser({
      email: user.email,
      name: user.name,
      password: user.password // Note: This should be hashed
    })
  }
}
```

### 7. Update Profile API

Update `app/api/user/profile/route.ts` to use Supabase:

```typescript
import { findUserById, updateUser } from '@/lib/supabase'
```

### 8. Test the Migration

1. Test user registration
2. Test user login
3. Test profile updates
4. Test admin panel

## 🔧 Configuration Files

### Environment Variables Template

```env
# Development
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
SUPABASE_URL=your-local-supabase-url
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key

# Production (Vercel)
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://glixtron.vercel.app
SUPABASE_URL=your-production-supabase-url
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
```

### Package.json Updates

Make sure these dependencies are installed:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2"
  }
}
```

## 🚨 Important Notes

### Security
- Always hash passwords with bcrypt before storing
- Use environment variables for all secrets
- Enable RLS (Row Level Security) in Supabase
- Use service role key only on server-side

### Performance
- Supabase has built-in connection pooling
- Consider edge functions for global deployment
- Use Supabase's real-time features for live updates

### Backup
- Supabase provides automatic backups
- Consider additional backup strategies for critical data

## 🔄 Rollback Plan

If you need to rollback to mock database:

1. Revert imports in API routes
2. Switch back to `authConfig` instead of `supabaseAuthConfig`
3. Remove Supabase environment variables
4. Deploy rollback

## 📞 Support

For Supabase issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Discord](https://discord.gg/supabase)

For application issues:
- Email: glixtron.global@gmail.com
- GitHub: glixtron/glixtron

---

**Ready for production with Supabase!** 🚀
