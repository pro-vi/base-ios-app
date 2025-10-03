import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { logger } from './logger';
import { isDemoMode, demoUser, demoCredentials } from './demo-mode';
import {
  signInWithGoogle,
  signInWithApple,
  signOutFromSocialProvider,
  configureGoogleSignIn,
} from './social-auth';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ user: any; error: any }>;
  signInWithApple: () => Promise<{ user: any; error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = isDemoMode();

  useEffect(() => {
    logger.info('Initializing auth session', { isDemo }, 'Auth');

    // Configure Google Sign-In on app start
    configureGoogleSignIn();

    if (isDemo) {
      AsyncStorage.getItem('demo_session').then((demoSession) => {
        if (demoSession) {
          setUser(demoUser as any);
          setSession({ user: demoUser } as any);
        }
        setLoading(false);
      });
      return;
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logger.error('Failed to get session', error, 'Auth');
      } else {
        logger.info('Session loaded', { hasSession: !!session, userId: session?.user?.id }, 'Auth');
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      logger.info(
        'Auth state changed',
        { event, hasSession: !!session, userId: session?.user?.id },
        'Auth'
      );
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isDemo]);

  const signIn = async (email: string, password: string) => {
    logger.info('Attempting sign in', { email, isDemo }, 'Auth');

    if (isDemo) {
      const normalizedEmail = email.toLowerCase();
      const validCredentials =
        (normalizedEmail === demoCredentials.email && password === demoCredentials.password) ||
        (normalizedEmail === 'test@example.com' && password === 'password123') ||
        (normalizedEmail === 'user@demo.com' && password === 'demo123');

      if (validCredentials) {
        await AsyncStorage.setItem('demo_session', 'true');
        await AsyncStorage.setItem('demo_email', normalizedEmail);
        setUser({ ...demoUser, email: normalizedEmail } as any);
        setSession({ user: { ...demoUser, email: normalizedEmail } } as any);
        logger.info('Demo sign in successful', { email }, 'Auth');
        return { error: null };
      } else {
        const error = { message: 'Invalid credentials. Try: test@example.com / password123' };
        logger.error('Demo sign in error', error, 'Auth');
        return { error };
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      logger.error('Sign in error', error, 'Auth');
    } else {
      logger.info('Sign in successful', { userId: data?.user?.id, email }, 'Auth');
    }

    return { error };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    logger.info('Attempting sign up', { email, isDemo }, 'Auth');

    if (isDemo) {
      await AsyncStorage.setItem('demo_session', 'true');
      setUser(demoUser as any);
      setSession({ user: demoUser } as any);
      logger.info('Demo sign up successful', { email }, 'Auth');
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    if (error) {
      logger.error('Sign up error', error, 'Auth');
    } else {
      logger.info('Sign up successful', { userId: data?.user?.id, email }, 'Auth');
    }

    return { error };
  };

  const signOut = async () => {
    logger.info('Signing out', { isDemo }, 'Auth');

    if (isDemo) {
      await AsyncStorage.removeItem('demo_session');
      setUser(null);
      setSession(null);
      logger.info('Demo sign out successful', null, 'Auth');
      return;
    }

    // Sign out from social providers
    await signOutFromSocialProvider();

    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error('Sign out error', error, 'Auth');
    } else {
      logger.info('Sign out successful', null, 'Auth');
    }
  };

  const deleteAccount = async () => {
    if (isDemo) {
      await signOut();
      return { error: null };
    }

    const { error } = await supabase.rpc('delete_user');
    if (!error) {
      await signOut();
    }
    return { error };
  };

  const handleSignInWithGoogle = async () => {
    if (isDemo) {
      await AsyncStorage.setItem('demo_session', 'true');
      setUser({ ...demoUser, email: 'google@demo.com' } as any);
      setSession({ user: { ...demoUser, email: 'google@demo.com' } } as any);
      logger.info('Demo Google sign in successful', null, 'Auth');
      return { user: demoUser, error: null };
    }
    return signInWithGoogle();
  };

  const handleSignInWithApple = async () => {
    if (isDemo) {
      await AsyncStorage.setItem('demo_session', 'true');
      setUser({ ...demoUser, email: 'apple@demo.com' } as any);
      setSession({ user: { ...demoUser, email: 'apple@demo.com' } } as any);
      logger.info('Demo Apple sign in successful', null, 'Auth');
      return { user: demoUser, error: null };
    }
    return signInWithApple();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isDemo,
        signIn,
        signUp,
        signOut,
        deleteAccount,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithApple: handleSignInWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
