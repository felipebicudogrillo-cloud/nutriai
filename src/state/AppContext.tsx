import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppData, Food, Goals, LogEntry, SavedMeal, WaterEntry } from "../types";
import { loadData, saveData } from "../lib/storage";
import { makeId } from "../lib/id";

interface AppContextValue {
  data: AppData;
  personalFoods: Food[];
  genericFoods: Food[];
  setGoals: (goals: Goals) => void;
  addEntries: (entries: Omit<LogEntry, "id" | "createdAt">[]) => void;
  updateEntry: (id: string, patch: Partial<LogEntry>) => void;
  deleteEntry: (id: string) => void;
  addCustomFood: (food: Omit<Food, "id" | "isPersonal" | "createdAt" | "useCount">) => Food;
  updateCustomFood: (id: string, patch: Partial<Food>) => void;
  deleteCustomFood: (id: string) => void;
  touchFoodUsage: (foodId: string) => void;
  addSavedMeal: (meal: Omit<SavedMeal, "id" | "createdAt" | "useCount">) => void;
  updateSavedMeal: (id: string, patch: Partial<SavedMeal>) => void;
  deleteSavedMeal: (id: string) => void;
  touchSavedMealUsage: (id: string) => void;
  addWater: (date: string, amountMl: number) => void;
  deleteWaterEntry: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const value = useMemo<AppContextValue>(() => {
    return {
      data,
      personalFoods: data.foods.filter((f) => f.isPersonal),
      genericFoods: data.foods.filter((f) => !f.isPersonal),

      setGoals(goals) {
        setData((d) => ({ ...d, goals }));
      },

      addEntries(entries) {
        const now = new Date().toISOString();
        setData((d) => {
          const newEntries: LogEntry[] = entries.map((e) => ({
            ...e,
            id: makeId(),
            createdAt: now,
          }));
          const usedFoodIds = new Set(entries.map((e) => e.foodId).filter(Boolean) as string[]);
          const foods = d.foods.map((f) =>
            usedFoodIds.has(f.id) ? { ...f, useCount: f.useCount + 1, lastUsedAt: now } : f
          );
          return { ...d, entries: [...d.entries, ...newEntries], foods };
        });
      },

      updateEntry(id, patch) {
        setData((d) => ({
          ...d,
          entries: d.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }));
      },

      deleteEntry(id) {
        setData((d) => ({ ...d, entries: d.entries.filter((e) => e.id !== id) }));
      },

      addCustomFood(food) {
        const now = new Date().toISOString();
        const newFood: Food = { ...food, id: makeId(), isPersonal: true, createdAt: now, useCount: 0 };
        setData((d) => ({ ...d, foods: [...d.foods, newFood] }));
        return newFood;
      },

      updateCustomFood(id, patch) {
        setData((d) => ({
          ...d,
          foods: d.foods.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        }));
      },

      deleteCustomFood(id) {
        setData((d) => ({ ...d, foods: d.foods.filter((f) => f.id !== id) }));
      },

      touchFoodUsage(foodId) {
        const now = new Date().toISOString();
        setData((d) => ({
          ...d,
          foods: d.foods.map((f) => (f.id === foodId ? { ...f, useCount: f.useCount + 1, lastUsedAt: now } : f)),
        }));
      },

      addSavedMeal(meal) {
        const now = new Date().toISOString();
        setData((d) => ({
          ...d,
          savedMeals: [...d.savedMeals, { ...meal, id: makeId(), createdAt: now, useCount: 0 }],
        }));
      },

      updateSavedMeal(id, patch) {
        setData((d) => ({
          ...d,
          savedMeals: d.savedMeals.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        }));
      },

      deleteSavedMeal(id) {
        setData((d) => ({ ...d, savedMeals: d.savedMeals.filter((m) => m.id !== id) }));
      },

      touchSavedMealUsage(id) {
        const now = new Date().toISOString();
        setData((d) => ({
          ...d,
          savedMeals: d.savedMeals.map((m) => (m.id === id ? { ...m, useCount: m.useCount + 1, lastUsedAt: now } : m)),
        }));
      },

      addWater(date, amountMl) {
        const now = new Date().toISOString();
        const entry: WaterEntry = { id: makeId(), date, amountMl, createdAt: now };
        setData((d) => ({ ...d, waterEntries: [...d.waterEntries, entry] }));
      },

      deleteWaterEntry(id) {
        setData((d) => ({ ...d, waterEntries: d.waterEntries.filter((e) => e.id !== id) }));
      },
    };
  }, [data]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
