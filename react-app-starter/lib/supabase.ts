import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const storage = Platform.OS === 'web' ? undefined : AsyncStorage;

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your_anon_key_here';

console.log('Supabase Configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  isConfigured,
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'none',
});

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      ...(storage && { storage }),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const supabaseConfig = {
  isConfigured,
  url: supabaseUrl,
};
