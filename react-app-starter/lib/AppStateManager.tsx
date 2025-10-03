import { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum AuthState {
  checking = 'checking',
  authenticated = 'authenticated',
  unauthenticated = 'unauthenticated',
  guest = 'guest',
}

interface AppState {
  authState: AuthState;
  currentUser: any | null;
  continueAsGuest: () => Promise<void>;
  exitGuestMode: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(AuthState.checking);
  const { user, session } = useAuth();

  useEffect(() => {
    const checkAuthState = async () => {
      if (session && user) {
        setAuthState(AuthState.authenticated);
      } else {
        const hasChosenGuestMode = await AsyncStorage.getItem('hasChosenGuestMode');
        if (hasChosenGuestMode === 'true') {
          setAuthState(AuthState.guest);
        } else {
          setAuthState(AuthState.unauthenticated);
        }
      }
    };

    checkAuthState();
  }, [session, user]);

  const continueAsGuest = async () => {
    await AsyncStorage.setItem('hasChosenGuestMode', 'true');
    setAuthState(AuthState.guest);
  };

  const exitGuestMode = async () => {
    await AsyncStorage.removeItem('hasChosenGuestMode');
    setAuthState(AuthState.unauthenticated);
  };

  const value: AppState = {
    authState,
    currentUser: user,
    continueAsGuest,
    exitGuestMode,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
