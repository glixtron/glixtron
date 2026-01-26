# 🚀 Real Authentication Setup Guide

This guide will help you set up complete real authentication with Supabase, email verification, and OAuth providers.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Google OAuth** (Optional): Create credentials at [Google Cloud Console](https://console.cloud.google.com)
3. **GitHub OAuth** (Optional): Create OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)

## 🔧 Step 1: Supabase Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `glixtron-auth`
5. Set database password (save it securely)
6. Choose region closest to your users
7. Click "Create new project"

### 2. Run Database Setup Script
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New query"
4. Copy the entire content of `scripts/setup-supabase.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the script

### 3. Get Supabase Credentials
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

## 🔐 Step 2: Configure Email Verification

### Option A: Use Supabase Email (Recommended)
1. Go to Authentication → Settings
2. Under "Email Templates", customize the confirmation email
3. Set "Enable email confirmations" to ON
4. Add your site URL to "Site URL" and "Redirect URLs"

### Option B: Custom Email Service
1. Configure SMTP settings in Authentication → Email
2. Or use the custom email endpoints we've created

## 🌐 Step 3: Set Up OAuth Providers

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
7. Copy Client ID and Client Secret

### GitHub OAuth Setup
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: `Glixtron`
   - Homepage URL: `https://your-domain.vercel.app`
   - Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`
4. Click "Register application"
5. Copy Client ID and generate Client Secret

## ⚙️ Step 4: Environment Variables Setup

### Local Development
Create `.env.local` file:
```bash
# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Vercel Deployment
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all the variables above
3. For production, set:
   - `NEXTAUTH_URL=https://your-domain.vercel.app`
4. Make sure all variables are enabled for Production, Preview, and Development

## 🧪 Step 5: Test the Setup

### 1. Database Connection Test
```bash
curl http://localhost:3000/api/debug/deployment-check
```

### 2. Registration Test
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123456!"}'
```

### 3. Email Verification Test
```bash
curl -X POST http://localhost:3000/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🎯 Step 6: Frontend Integration

### Update Login Page
The login page now supports:
- Email/Password authentication
- Google OAuth
- GitHub OAuth
- Error handling for unverified emails

### Update Registration Page
Registration now:
- Creates user in Supabase Auth
- Creates profile in database
- Sends verification email
- Handles OAuth fallback

### Email Verification Flow
1. User registers → gets verification email
2. User clicks verification link → email verified
3. User can now log in successfully

## 🔍 Step 7: Debugging

### Common Issues & Solutions

#### Issue: "Invalid login credentials"
- **Cause**: Email not verified or wrong password
- **Solution**: Check email verification status

#### Issue: "User already exists"
- **Cause**: Email already in database
- **Solution**: Use different email or implement password reset

#### Issue: OAuth redirect errors
- **Cause**: Incorrect redirect URLs in OAuth provider settings
- **Solution**: Verify callback URLs match your domain

#### Issue: Database connection errors
- **Cause**: Wrong Supabase credentials
- **Solution**: Verify environment variables

### Debug Endpoints
- `/api/debug/deployment-check` - Full system check
- `/api/test/env` - Environment variables check
- `/api/status` - Basic app status

## 🚀 Step 8: Production Deployment

### Before Deploying
1. ✅ Test all authentication flows locally
2. ✅ Verify email sending works
3. ✅ Test OAuth providers
4. ✅ Check database permissions
5. ✅ Set up monitoring

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy and test

### Post-Deployment
1. Test all authentication flows
2. Monitor error logs
3. Set up analytics
4. Configure backup

## 📊 Features Implemented

### ✅ Authentication
- [x] Email/Password registration and login
- [x] Google OAuth integration
- [x] GitHub OAuth integration
- [x] Email verification
- [x] Password reset (can be added)
- [x] Session management
- [x] Secure token handling

### ✅ Database
- [x] Supabase PostgreSQL integration
- [x] User profiles table
- [x] Email verification tracking
- [x] Row Level Security (RLS)
- [x] Automatic timestamps
- [x] Data validation

### ✅ Security
- [x] Password hashing (bcrypt)
- [x] JWT tokens
- [x] CSRF protection
- [x] Rate limiting (can be added)
- [x] Input validation
- [x] SQL injection protection

### ✅ User Experience
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Success messages
- [x] Email notifications
- [x] Social login options

## 🎉 Next Steps

1. **Add More OAuth Providers**: LinkedIn, Twitter, etc.
2. **Implement Password Reset**: Forgot password flow
3. **Add Two-Factor Authentication**: Enhanced security
4. **User Profile Management**: Edit profile, upload avatar
5. **Admin Dashboard**: User management
6. **Analytics**: Track registration and login metrics
7. **Email Templates**: Custom email designs
8. **API Rate Limiting**: Prevent abuse

## 📞 Support

If you encounter any issues:
1. Check the debug endpoints
2. Review Supabase logs
3. Verify environment variables
4. Check browser console for errors
5. Review this guide for common solutions

---

**🎉 Your real authentication system is now ready! Users can register, verify emails, and log in using multiple authentication methods.**
