export const isDemoMode = () => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  return (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl === 'your_supabase_url_here' ||
    supabaseKey === 'your_anon_key_here'
  );
};

export const demoUser = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  user_metadata: {
    name: 'Demo User',
  },
};

export const demoCredentials = {
  email: 'demo@example.com',
  password: 'demo123',
};

export const testCredentials = [
  { email: 'test@example.com', password: 'password123' },
  { email: 'user@demo.com', password: 'demo123' },
];
