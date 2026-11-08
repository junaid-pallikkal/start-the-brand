import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

// Browser client for client components
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
    // Return null or safely handled fallback when credentials are not yet configured
    return null;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
