import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

 const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
 const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

// Environment variables kontrolü
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey);
}



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage:Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: "pkce",
  },
})