// Supabase configuration
// Use the official CDN ESM import for supabase-js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Production environment variables - ensure these are set correctly in your deployment
const SUPABASE_URL = 'https://pjzdfqhwgbbqsctvcveq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqemRmcWh3Z2JicXNjdHZjdmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjE3OTcsImV4cCI6MjA2NjQzNzc5N30.H52NQ_dQz7_-du1VRFY-b0kE7qr6d1gaXuDZblhIU6Q';

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 