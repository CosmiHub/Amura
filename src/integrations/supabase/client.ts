

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hofgdvgmplqwdqkgevvd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZmdkdmdtcGxxd2Rxa2dldnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzI4ODksImV4cCI6MjA2MDgwODg4OX0.zTH9UQ_0LZSo-4QwpjpLttm2UxXyljYvWHPxaZVnGQk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
