-- Open the "Funnel" - Grant permissions for all roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Refresh the funnel connection
NOTIFY pgrst, 'reload schema';

-- Verify permissions
SELECT 
    table_name,
    has_table_privilege('anon', table_name, 'SELECT') as anon_select,
    has_table_privilege('authenticated', table_name, 'INSERT') as auth_insert,
    has_table_privilege('service_role', table_name, 'ALL') as service_all
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'users';
