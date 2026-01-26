-- Verification Script: Check if User Data is Landing in Tables
-- Run this after registration to verify everything is working

-- 1. Check latest user in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Check latest user in public.users
SELECT 
  id,
  email,
  name,
  email_verified,
  provider,
  created_at,
  updated_at
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Check if IDs match (this confirms trigger worked)
SELECT 
  auth_users.id as auth_id,
  auth_users.email as auth_email,
  public_users.id as public_id,
  public_users.email as public_email,
  public_users.name as public_name,
  CASE 
    WHEN auth_users.id = public_users.id THEN '✅ MATCH'
    ELSE '❌ MISMATCH'
  END as sync_status
FROM (
  SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1
) auth_users
LEFT JOIN (
  SELECT id, email, name FROM public.users ORDER BY created_at DESC LIMIT 1
) public_users ON auth_users.id = public_users.id;

-- 4. Count total users in both tables
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users) 
    THEN '✅ SYNCED'
    ELSE '❌ OUT OF SYNC'
  END as overall_sync;

-- 5. Check trigger status
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  action_condition,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
AND trigger_schema = 'public';
