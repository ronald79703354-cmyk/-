import { createClient } from '@supabase/supabase-js';

// The Supabase URL for your project, provided by you.
const supabaseUrl = 'https://ekhetmtyodrrkwrhqkoi.supabase.co';

// The Supabase Public Anonymous Key for your project.
// IMPORTANT: This key is safe to expose in a browser client.
// DO NOT use a service_role or secret key here, as it would expose sensitive operations to the public.
// You must get this key from your Supabase project's API settings.
const supabaseAnonKey = 'YOUR_PUBLIC_ANON_KEY';

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'YOUR_PUBLIC_ANON_KEY') {
    throw new Error("Supabase URL and a valid Anon Key are required. Please replace 'YOUR_PUBLIC_ANON_KEY' in services/supabaseClient.ts with the actual key from your Supabase dashboard.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
