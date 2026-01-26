# 🚀 Production Authentication Guide

## **⚡ Current Status: PRODUCTION READY**

Your Supabase backend is fully configured and ready for production use.

---

## **📋 Architecture Overview**

### **✅ Database Configuration**
- **Tables**: `public.users`, `user_profiles`, `assessments`, `email_verifications`
- **Trigger**: `on_auth_user_created` (SECURITY DEFINER)
- **Email Confirmation**: **DISABLED** (instant registration)
- **Rate Limiting**: Bypassed via disabled email confirmation

### **🔄 Automated User Sync**
When `supabase.auth.signUp()` is called:
1. User created in `auth.users`
2. Trigger `on_auth_user_created` automatically fires
3. User data inserted into `public.users`
4. User immediately authenticated (no email verification)

---

## **🔑 Critical Implementation Rules**

### **✅ DO: Include Name in Options**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'User Name', // REQUIRED for trigger
      avatar_url: 'https://ui-avatars.com/api/?name=User+Name'
    }
  }
})
```

### **❌ DON'T: Manual Database Inserts**
```javascript
// NEVER DO THIS - Will cause primary key violations!
const { error } = await supabase
  .from('users')
  .insert({ email, name }) // ❌ Trigger already does this!
```

### **✅ DO: Handle Immediate Authentication**
```javascript
// After successful signUp, user is already authenticated
if (data.user) {
  // User can be redirected to dashboard immediately
  router.push('/welcome')
}
```

---

## **🛠️ Environment Variables**

### **Required Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **⚠️ Important Notes**
- `NEXT_PUBLIC_SUPABASE_URL` should **NOT** end with `/`
- Use `NEXT_PUBLIC_` prefix for client-side access
- Service role key for admin operations only

---

## **🔍 Testing & Verification**

### **1. Registration Test**
```javascript
// Test with new user
const result = await supabase.auth.signUp({
  email: 'test+timestamp@example.com',
  password: 'TestPassword123!',
  options: {
    data: { name: 'Test User' }
  }
})
```

### **2. Database Verification**
```sql
-- Check if user was created automatically
SELECT * FROM public.users 
ORDER BY created_at DESC 
LIMIT 1;
```

### **3. Auth Verification**
```sql
-- Check auth.users table
SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## **🚨 Error Handling**

### **Common Issues & Solutions**

#### **"Fetch Failed" Error**
- **Cause**: Environment variable or network issue
- **Solution**: Check `.env.local` and ensure URL has no trailing `/`

#### **"Rate Limit" Error**
- **Cause**: Email confirmation enabled
- **Solution**: Ensure email confirmation is disabled in Supabase Dashboard

#### **"Schema Cache" Error**
- **Cause**: API hasn't recognized new tables
- **Solution**: Run `NOTIFY pgrst, 'reload schema';` in SQL Editor

#### **"Primary Key Violation"**
- **Cause**: Manual insert + trigger both creating user
- **Solution**: Remove manual insert logic

---

## **🔧 Production Components**

### **ProductionSignup Component**
- ✅ Follows all architectural rules
- ✅ Includes name in options.data
- ✅ Handles immediate authentication
- ✅ Proper error handling
- ✅ No manual database operations

### **Usage**
```tsx
import ProductionSignup from '@/components/ProductionSignup'

export default function RegisterPage() {
  return <ProductionSignup />
}
```

---

## **📊 Database Schema**

### **public.users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,                    -- From auth.users
  email TEXT UNIQUE NOT NULL,             -- From auth.users
  name TEXT NOT NULL,                     -- From trigger
  email_verified BOOLEAN DEFAULT FALSE,   -- From trigger
  provider TEXT DEFAULT 'email',          -- From trigger
  avatar_url TEXT,                        -- From options.data
  created_at TIMESTAMP WITH TIME ZONE,    -- From auth.users
  updated_at TIMESTAMP WITH TIME ZONE     -- Trigger updates
);
```

### **Trigger Function**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, email_verified, provider, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.email_confirmed_at IS NOT NULL,
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;
```

---

## **🎯 Next Steps**

### **1. Test Registration**
- Use `ProductionSignup` component
- Verify user appears in both tables
- Confirm immediate authentication

### **2. Deploy to Production**
- Set environment variables in Vercel/Netlify
- Test with production database
- Monitor for any errors

### **3. Monitor Performance**
- Check Supabase logs
- Monitor trigger performance
- Track registration metrics

---

## **🆘 Support**

### **Debug Tools**
- **Health Check**: `/api/debug/health`
- **User Verification**: `/api/debug/verify-users`
- **Direct Test**: `/api/test/supabase-direct`

### **Common Commands**
```sql
-- Reload schema if needed
NOTIFY pgrst, 'reload schema';

-- Check trigger status
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check recent users
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;
```

---

## **✅ Production Checklist**

- [x] Database tables created
- [x] Trigger installed and active
- [x] Email confirmation disabled
- [x] Environment variables configured
- [x] Production components ready
- [x] Error handling implemented
- [x] Testing procedures documented
- [x] Support tools available

**🎉 Your authentication system is production-ready!**
