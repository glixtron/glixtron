# Database Setup Guide

## Current Implementation

The application currently uses a **mock in-memory database** that is production-ready in structure but needs to be replaced with a real database for production use.

## Database Structure

### Schema Definitions

All database schemas are defined in `lib/db-schema.ts`:

1. **User** - User accounts
2. **AssessmentData** - Career assessment results
3. **ResumeScan** - Resume analysis scans
4. **UserData** - Aggregated user data

### API Endpoints

All data operations go through REST API endpoints:

- `GET /api/user/data` - Get all user data
- `GET /api/user/resume-text` - Get saved resume text
- `POST /api/user/resume-text` - Save resume text
- `GET /api/user/resume-scans` - Get all resume scans
- `POST /api/user/resume-scans` - Save a new scan
- `DELETE /api/user/resume-scans?id=xxx` - Delete a scan
- `GET /api/user/assessment` - Get assessment data
- `POST /api/user/assessment` - Save assessment data

## Production Database Options

### Option 1: PostgreSQL with Prisma

1. Install Prisma:
```bash
npm install prisma @prisma/client
npx prisma init
```

2. Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String?
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  provider      String    @default("credentials")
  image         String?
  
  assessment    Assessment?
  resumeScans   ResumeScan[]
}

model Assessment {
  id               String   @id @default(cuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  coreSkills       String[]
  softSkills       String[]
  remotePreference Int
  startupPreference Int
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model ResumeScan {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  resumeText  String   @db.Text
  jdText      String   @db.Text
  jdLink      String?
  analysis    Json
  matchScore  Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
}
```

3. Update `lib/database.ts` to use Prisma client

### Option 2: MongoDB with Mongoose

1. Install Mongoose:
```bash
npm install mongoose
```

2. Create models in `lib/models/`:
```typescript
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // ... other fields
})

export const User = mongoose.model('User', UserSchema)
```

3. Update `lib/database.ts` to use Mongoose models

### Option 3: Supabase (PostgreSQL)

1. Install Supabase client:
```bash
npm install @supabase/supabase-js
```

2. Create tables in Supabase dashboard
3. Update `lib/database.ts` to use Supabase client

## Migration Steps

1. **Choose your database** (PostgreSQL, MongoDB, etc.)

2. **Install database client library**

3. **Create database schema/tables**

4. **Update `lib/database.ts`**:
   - Replace mock Map storage with real database calls
   - Keep the same function signatures
   - Add error handling
   - Add connection pooling

5. **Update environment variables**:
   ```env
   DATABASE_URL=your-database-connection-string
   ```

6. **Test all API endpoints**:
   - User registration/login
   - Resume text saving/loading
   - Resume scan saving/loading
   - Assessment data saving/loading

## Current Mock Implementation

The mock implementation in `lib/database.ts` uses:
- `Map` for in-memory storage
- Same function signatures as production
- All API endpoints work correctly
- Ready for drop-in replacement

## Testing

All API endpoints are ready and tested with the mock database. When you switch to a real database:

1. All existing API calls will continue to work
2. No frontend changes needed
3. Just replace the database functions in `lib/database.ts`

## Security Notes

- All API endpoints require authentication
- User data is isolated by userId
- Password hashing should be implemented (bcrypt)
- Use prepared statements to prevent SQL injection
- Validate all inputs

---

*The database structure is production-ready. Just replace the mock implementation with your chosen database.*
