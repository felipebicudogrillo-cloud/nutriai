export type Unit = "g" | "ml" | "unidade";

export type FoodBasis = "per100" | "perUnit";

export interface Food {
  id: string;
  name: string;
  brand?: string;
  isPersonal: boolean;
  aliases: string[];
  unit: Unit;
  basis: FoodBasis;
  /** grams/ml represented by one "unidade" when basis === perUnit; or the reference amount for per100 (always 100) */
  refAmount: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  emoji?: string;
  createdAt: string;
  lastUsedAt?: string;
  useCount: number;
}

export type MealSlot = "cafe" | "almoco" | "lanche" | "jantar" | "outro";

export const MEAL_LABELS: Record<MealSlot, string> = {
  cafe: "Café da manhã",
  almoco: "Almoço",
  lanche: "Lanche",
  jantar: "Jantar",
  outro: "Outro",
};

export interface LogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  meal: MealSlot;
  foodId?: string;
  foodName: string;
  emoji?: string;
  quantity: number;
  unit: Unit;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  isEstimate: boolean;
  source: "personal" | "generic" | "estimate";
  createdAt: string;
}

export interface SavedMealItem {
  foodId?: string;
  foodName: string;
  emoji?: string;
  quantity: number;
  unit: Unit;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  isEstimate: boolean;
  source: "personal" | "generic" | "estimate";
}

export interface SavedMeal {
  id: string;
  name: string;
  items: SavedMealItem[];
  createdAt: string;
  lastUsedAt?: string;
  useCount: number;
}

export interface Goals {
  kcal: number;
  protein: number;
  carbs?: number;
  fat?: number;
  sugar?: number;
  water?: number;
}

export interface WaterEntry {
  id: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  createdAt: string;
}

export interface AppData {
  version: number;
  goals: Goals;
  foods: Food[];
  entries: LogEntry[];
  savedMeals: SavedMeal[];
  waterEntries: WaterEntry[];
}

export interface Totals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
}
