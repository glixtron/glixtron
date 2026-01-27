-- Final Funnel Refresh - Clear any remaining blocks
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Ensure users table is properly configured
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they work
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Final refresh
NOTIFY pgrst, 'reload schema';

-- Verify everything is ready
SELECT 
    'users table permissions' as check_type,
    has_table_privilege('authenticated', 'users', 'INSERT') as can_insert,
    has_table_privilege('authenticated', 'users', 'SELECT') as can_select,
    has_table_privilege('authenticated', 'users', 'UPDATE') as can_update;
