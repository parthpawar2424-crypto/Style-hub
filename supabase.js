// supabase.js

const SUPABASE_URL = "https://lnjkpbbjzjrpuwhmbqkd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuamtwYnBpempycHVod21icWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTQwNTMsImV4cCI6MjA4MzE5MDA1M30.VSPdTEwoSs4DEreHGwKSHjnDE9qGD-Lp9iLM6V3zMlw";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: window.localStorage
    }
  }
);
