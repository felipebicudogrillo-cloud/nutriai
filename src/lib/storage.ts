import type { AppData } from "../types";
import { buildGenericFoods } from "../data/genericFoods";

const KEY = "nutriai:data:v1";

function defaultData(): AppData {
  return {
    version: 1,
    goals: { kcal: 2000, protein: 160, carbs: 220, fat: 65 },
    foods: buildGenericFoods(),
    entries: [],
    savedMeals: [],
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as AppData;
    // Re-sync generic foods so app updates (new foods, fixed macros) reach existing users
    // without touching anything the user personalized.
    const generic = buildGenericFoods();
    const personal = parsed.foods.filter((f) => f.isPersonal);
    const mergedGeneric = generic.map((g) => {
      const prevUsage = parsed.foods.find((f) => f.id === g.id);
      return prevUsage
        ? { ...g, useCount: prevUsage.useCount, lastUsedAt: prevUsage.lastUsedAt }
        : g;
    });
    return { ...defaultData(), ...parsed, foods: [...mergedGeneric, ...personal] };
  } catch {
    return defaultData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}
