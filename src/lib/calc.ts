import type { Food, LogEntry, Totals } from "../types";

export function macrosForQuantity(food: Food, quantity: number): Omit<Totals, never> {
  const factor = food.basis === "per100" ? quantity / 100 : quantity;
  return {
    kcal: round(food.kcal * factor),
    protein: round1(food.protein * factor),
    carbs: round1(food.carbs * factor),
    fat: round1(food.fat * factor),
    sugar: round1(food.sugar * factor),
  };
}

export function sumTotals(
  entries: { kcal: number; protein: number; carbs: number; fat: number; sugar: number }[]
): Totals {
  return entries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
      sugar: acc.sugar + e.sugar,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 }
  );
}

export function entriesForDay(entries: LogEntry[], date: string): LogEntry[] {
  return entries.filter((e) => e.date === date);
}

export function round(n: number): number {
  return Math.round(n);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function pct(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

export function withinGoal(value: number, goal: number, tolerancePct = 0): boolean {
  if (goal <= 0) return true;
  return value <= goal * (1 + tolerancePct);
}
