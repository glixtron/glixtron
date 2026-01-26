import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-real'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 Testing Supabase Setup');
    console.log('========================');
    
    const results = {
      connection: false,
      tables: {} as Record<string, boolean>,
      errors: [] as string[],
      recommendations: [] as string[]
    }

    // Test basic connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        if (error.code === 'PGRST116') {
          results.errors.push('Table "users" does not exist');
          results.recommendations.push('Run the database setup script in Supabase SQL Editor');
        } else {
          results.errors.push(`Connection error: ${error.message}`);
          results.recommendations.push('Check Supabase URL and API keys');
        }
      } else {
        results.connection = true;
        results.tables.users = true;
      }
    } catch (error: any) {
      results.errors.push(`Connection test failed: ${error.message}`);
    }

    // Check all required tables
    const requiredTables = ['users', 'user_profiles', 'assessments', 'email_verifications'];
    
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          results.tables[table] = false;
          if (error.code === 'PGRST116') {
            results.errors.push(`Table "${table}" does not exist`);
          }
        } else {
          results.tables[table] = true;
        }
      } catch (error) {
        results.tables[table] = false;
      }
    }

    // Generate recommendations
    if (!results.connection) {
      results.recommendations.push('Check Supabase project URL and API keys');
      results.recommendations.push('Ensure Supabase project is active');
    }

    const missingTables = Object.entries(results.tables)
      .filter(([_, exists]) => !exists)
      .map(([name]) => name);

    if (missingTables.length > 0) {
      results.recommendations.push(`Create missing tables: ${missingTables.join(', ')}`);
      results.recommendations.push('Run scripts/setup-supabase.sql in Supabase SQL Editor');
    }

    if (results.connection && missingTables.length === 0) {
      results.recommendations.push('✅ Database setup is complete!');
    }

    return NextResponse.json({
      success: results.connection,
      results,
      setup: {
        sqlScript: 'scripts/setup-supabase.sql',
        instructions: [
          '1. Go to your Supabase project dashboard',
          '2. Click on "SQL Editor" in the sidebar',
          '3. Click "New query"',
          '4. Copy the content of scripts/setup-supabase.sql',
          '5. Paste it and click "Run"'
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'create-tables') {
      // This would require service role key, so we'll just provide instructions
      return NextResponse.json({
        success: false,
        message: 'Tables must be created manually in Supabase dashboard',
        instructions: [
          '1. Go to your Supabase project dashboard',
          '2. Click on "SQL Editor" in the sidebar',
          '3. Click "New query"',
          '4. Copy the content of scripts/setup-supabase.sql',
          '5. Paste it and click "Run"'
        ]
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
