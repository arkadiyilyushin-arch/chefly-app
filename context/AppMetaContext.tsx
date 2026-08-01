import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const ONBOARD_KEY = 'chefly.onboarding.v1';
const SEARCH_KEY = 'chefly.searchHistory.v1';

export type OnboardingState = {
  done: boolean;
  role: 'home' | 'pro' | 'lover' | null;
  cuisines: string[];
};

type AppMetaValue = {
  ready: boolean;
  onboarding: OnboardingState;
  searchHistory: string[];
  completeOnboarding: (data: Omit<OnboardingState, 'done'>) => Promise<void>;
  addSearchQuery: (q: string) => void;
  clearSearchHistory: () => void;
};

const defaultOnboarding: OnboardingState = {
  done: false,
  role: null,
  cuisines: [],
};

const AppMetaContext = createContext<AppMetaValue | null>(null);

export function AppMetaProvider({ children }: { children: ReactNode }) {
  const [onboarding, setOnboarding] = useState<OnboardingState>(defaultOnboarding);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [ob, sh, session] = await Promise.all([
        AsyncStorage.getItem(ONBOARD_KEY),
        AsyncStorage.getItem(SEARCH_KEY),
        AsyncStorage.getItem('chefly.session'),
      ]);
      if (ob) {
        setOnboarding({ ...defaultOnboarding, ...(JSON.parse(ob) as OnboardingState) });
      } else if (session) {
        // Уже залогиненные пользователи не видят онбординг повторно
        const migrated = { ...defaultOnboarding, done: true };
        setOnboarding(migrated);
        await AsyncStorage.setItem(ONBOARD_KEY, JSON.stringify(migrated));
      }
      if (sh) setSearchHistory(JSON.parse(sh) as string[]);
      setReady(true);
    })();
  }, []);

  const completeOnboarding = useCallback(async (data: Omit<OnboardingState, 'done'>) => {
    const next = { ...data, done: true };
    setOnboarding(next);
    await AsyncStorage.setItem(ONBOARD_KEY, JSON.stringify(next));
  }, []);

  const addSearchQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      const next = [trimmed, ...searchHistory.filter((x) => x !== trimmed)].slice(0, 12);
      setSearchHistory(next);
      void AsyncStorage.setItem(SEARCH_KEY, JSON.stringify(next));
    },
    [searchHistory]
  );

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    void AsyncStorage.removeItem(SEARCH_KEY);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      onboarding,
      searchHistory,
      completeOnboarding,
      addSearchQuery,
      clearSearchHistory,
    }),
    [ready, onboarding, searchHistory, completeOnboarding, addSearchQuery, clearSearchHistory]
  );

  return <AppMetaContext.Provider value={value}>{children}</AppMetaContext.Provider>;
}

export function useAppMeta() {
  const ctx = useContext(AppMetaContext);
  if (!ctx) throw new Error('useAppMeta must be used within AppMetaProvider');
  return ctx;
}
