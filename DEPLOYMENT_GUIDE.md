# 🚀 Production Deployment Guide

## Overview
This guide covers the complete setup for deploying Glixtron with multi-server failover, continuous integration, and zero-downtime deployments.

## 🏗️ Architecture

### Multi-Server Setup
- **Primary**: Vercel (https://glixtron.vercel.app)
- **Secondary**: Vercel Preview (https://glixtron-git-main-glixtron.vercel.app)
- **Fallback 1**: GitHub Pages (https://glixtron.github.io)
- **Fallback 2**: Netlify (https://glixtron.netlify.app)

### Database
- **Primary**: Supabase (PostgreSQL)
- **Fallback**: Persistent JSON storage

### CI/CD
- **GitHub Actions**: Automated testing and deployment
- **Health Checks**: Automatic server monitoring
- **Rollback**: Automatic failover to healthy servers

## 📋 Prerequisites

### Required Services
1. **Vercel Account** - Primary hosting
2. **Supabase Project** - Database and auth
3. **GitHub Repository** - Source code and CI/CD
4. **Domain Name** - Custom domain (optional)

### Environment Variables
```bash
# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel (for GitHub Actions)
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

## 🛠️ Setup Instructions

### 1. Supabase Setup

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project
   # Note down URL and keys
   ```

2. **Create Database Tables**
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     name VARCHAR(255) NOT NULL,
     password VARCHAR(255) NOT NULL,
     email_verified BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Assessments table
   CREATE TABLE assessments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     assessment_data JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Resume scans table
   CREATE TABLE resume_scans (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     scan_data JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Indexes
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_assessments_user_id ON assessments(user_id);
   CREATE INDEX idx_resume_scans_user_id ON resume_scans(user_id);
   ```

3. **Set up Row Level Security (RLS)**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE resume_scans ENABLE ROW LEVEL SECURITY;

   -- Policies
   CREATE POLICY "Users can view own profile" ON users
     FOR SELECT USING (auth.uid()::text = id::text);

   CREATE POLICY "Users can update own profile" ON users
     FOR UPDATE USING (auth.uid()::text = id::text);
   ```

### 2. Vercel Setup

1. **Connect GitHub Repository**
   ```bash
   # Import project to Vercel
   # Connect GitHub repository
   # Set up environment variables
   ```

2. **Configure Environment Variables**
   ```bash
   # In Vercel dashboard, add all environment variables
   # Set NEXTAUTH_URL to your domain
   # Add Supabase credentials
   ```

3. **Deploy**
   ```bash
   # Automatic deployment on push to main
   # Preview deployments for PRs
   ```

### 3. GitHub Actions Setup

1. **Repository Secrets**
   ```bash
   # Add these secrets to GitHub repository:
   # NEXTAUTH_URL
   # NEXTAUTH_SECRET
   # SUPABASE_URL
   # SUPABASE_ANON_KEY
   # SUPABASE_SERVICE_ROLE_KEY
   # VERCEL_TOKEN
   # VERCEL_ORG_ID
   # VERCEL_PROJECT_ID
   ```

2. **Workflow Configuration**
   - Already configured in `.github/workflows/deploy.yml`
   - Includes health checks and rollback

### 4. Fallback Servers Setup

#### GitHub Pages (Optional)
1. Enable GitHub Pages in repository settings
2. Configure custom domain if needed
3. Set up static build

#### Netlify (Optional)
1. Connect GitHub repository to Netlify
2. Configure build settings
3. Set up environment variables

## 🔧 Configuration

### Server Configuration
Edit `lib/server-config.ts` to update server endpoints:

```typescript
export const SERVER_CONFIG: ServerConfig = {
  primary: [
    {
      id: 'vercel-primary',
      name: 'Vercel Primary',
      url: 'https://yourdomain.com',
      priority: 1,
      isHealthy: true,
      lastChecked: new Date(),
      region: 'global'
    }
    // Add more servers...
  ]
}
```

### Environment Configuration
Edit `lib/env-config.ts` to update feature flags and timeouts.

## 🚀 Deployment Process

### Automatic Deployment
1. **Push to main branch**
   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```

2. **GitHub Actions will:**
   - Run tests
   - Build application
   - Deploy to Vercel
   - Run health checks
   - Notify on success/failure

### Manual Deployment
```bash
# Deploy to Vercel
vercel --prod

# Check health
curl https://yourdomain.com/api/health
```

## 🔍 Monitoring

### Health Checks
- **Endpoint**: `/api/health`
- **Deep Check**: POST `/api/health` with `{"action": "deep-check"}`
- **Server Status**: Available via API client

### Automatic Failover
- Servers checked every 30 seconds
- Automatic switching on failure
- Exponential backoff for retries

### Logging
- Server health status logged
- API errors tracked
- Performance metrics collected

## 🔄 Testing

### Local Testing
```bash
# Test with production config
npm run build
npm start

# Test API endpoints
curl http://localhost:3000/api/health
```

### Production Testing
```bash
# Test all servers
curl https://yourdomain.com/api/health
curl https://backup-server.com/api/health

# Test failover
# (Simulate server failure)
```

## 🛡️ Security

### Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Environment Variables
- All secrets stored in environment variables
- No hardcoded credentials
- Secure transmission with HTTPS

### Authentication
- NextAuth.js for session management
- JWT tokens with expiration
- Secure password hashing

## 📊 Performance

### Optimization
- Multi-region deployment
- CDN caching
- Database indexing
- API response caching

### Monitoring
- Response time tracking
- Error rate monitoring
- Server health status
- User analytics

## 🚨 Troubleshooting

### Common Issues

#### Server Not Responding
```bash
# Check server status
curl https://yourdomain.com/api/health

# Check GitHub Actions
# Go to Actions tab in repository

# Check Vercel logs
# Go to Vercel dashboard > Functions > Logs
```

#### Database Connection Issues
```bash
# Check Supabase status
# Verify environment variables
# Test database connection
```

#### Authentication Issues
```bash
# Check NEXTAUTH_SECRET
# Verify NEXTAUTH_URL
# Check session configuration
```

### Emergency Procedures

#### Complete Server Failure
1. GitHub Actions will detect failure
2. Automatic rollback to previous deployment
3. Fallback servers activated
4. Notifications sent

#### Database Issues
1. Switch to persistent JSON storage
2. Data synchronization when database recovers
3. User notifications sent

## 📈 Scaling

### Horizontal Scaling
- Add more server endpoints
- Load balancer configuration
- Geographic distribution

### Vertical Scaling
- Increase function memory
- Optimize database queries
- Implement caching

## 🔄 Maintenance

### Regular Tasks
- Update dependencies
- Monitor server health
- Review security logs
- Update SSL certificates

### Backup Procedures
- Database backups (Supabase automatic)
- Code repository (GitHub)
- Configuration files
- Environment variables documentation

## 📞 Support

### Monitoring Dashboard
- Server status overview
- Performance metrics
- Error tracking
- User analytics

### Alerting
- Server downtime alerts
- Performance degradation
- Security incidents
- Error rate thresholds

---

## 🎉 Success Criteria

✅ **Zero Downtime**: Automatic failover ensures continuous service  
✅ **High Availability**: Multiple server endpoints with health monitoring  
✅ **Scalable Architecture**: Easy to add new servers and regions  
✅ **Robust Testing**: Comprehensive health checks and monitoring  
✅ **Security First**: Proper authentication and data protection  
✅ **Developer Friendly**: Easy deployment and debugging tools  

Your Glixtron application is now production-ready with enterprise-grade reliability! 🚀
