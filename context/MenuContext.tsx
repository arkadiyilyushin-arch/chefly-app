import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const MENU_KEY = 'chefly.menu.v1';

export const WEEK_DAYS = [
  { id: 'mon', label: 'Пн' },
  { id: 'tue', label: 'Вт' },
  { id: 'wed', label: 'Ср' },
  { id: 'thu', label: 'Чт' },
  { id: 'fri', label: 'Пт' },
  { id: 'sat', label: 'Сб' },
  { id: 'sun', label: 'Вс' },
] as const;

export type DayId = (typeof WEEK_DAYS)[number]['id'];

type MenuState = {
  plan: Record<DayId, string | null>;
  checkedItems: string[];
};

type MenuContextValue = {
  plan: Record<DayId, string | null>;
  setDayMeal: (day: DayId, postId: string | null) => void;
  checkedItems: string[];
  toggleChecked: (item: string) => void;
  clearChecked: () => void;
};

const emptyPlan = (): Record<DayId, string | null> => ({
  mon: null,
  tue: null,
  wed: null,
  thu: null,
  fri: null,
  sat: null,
  sun: null,
});

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MenuState>({ plan: emptyPlan(), checkedItems: [] });

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(MENU_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MenuState;
        setState({
          plan: { ...emptyPlan(), ...(parsed.plan ?? {}) },
          checkedItems: parsed.checkedItems ?? [],
        });
      }
    })();
  }, []);

  const persist = useCallback((next: MenuState) => {
    setState(next);
    void AsyncStorage.setItem(MENU_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo<MenuContextValue>(
    () => ({
      plan: state.plan,
      setDayMeal(day, postId) {
        persist({ ...state, plan: { ...state.plan, [day]: postId } });
      },
      checkedItems: state.checkedItems,
      toggleChecked(item) {
        const on = state.checkedItems.includes(item);
        persist({
          ...state,
          checkedItems: on
            ? state.checkedItems.filter((x) => x !== item)
            : [...state.checkedItems, item],
        });
      },
      clearChecked() {
        persist({ ...state, checkedItems: [] });
      },
    }),
    [state, persist]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
