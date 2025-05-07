import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ualzgryrkwktiqndotzo.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbHpncnlya3drdGlxbmRvdHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzI1OTksImV4cCI6MjA2MTQ0ODU5OX0.E8X5frjFHTTERE52jnS4YbkMb_qex1KsQBOUvZqhOiY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      Accept: 'application/json',
    },
  },
});