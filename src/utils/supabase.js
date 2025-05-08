import { createClient } from '@supabase/supabase-js';

// Hardcode values temporarily to unblock fetch
const supabaseUrl = 'https://ualzgryrkwktiqndotzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbHpncnlya3drdGlxbmRvdHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzI1OTksImV4cCI6MjA2MTQ0ODU5OX0.E8X5frjFHTTERE52jnS4YbkMb_qex1KsQBOUvZqhOiY';

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
      'Cache-Control': 'no-cache',
    },
  },
});