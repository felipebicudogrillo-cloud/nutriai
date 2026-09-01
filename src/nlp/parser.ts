import type { Food, MealSlot, SavedMeal, Unit } from "../types";
import { makeId } from "../lib/id";
import { macrosForQuantity } from "../lib/calc";
import { digitizeNumberWords } from "./numberWords";
import { inferMealFromTime } from "../lib/date";

export interface ParsedItem {
  id: string;
  rawText: string;
  quantity: number;
  unit: Unit;
  foodId?: string;
  foodName: string;
  emoji?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  isEstimate: boolean;
  source: "personal" | "generic" | "estimate";
  status: "resolved" | "ambiguous" | "unresolved";
  candidates?: Food[];
}

export interface ParseResult {
  meal: MealSlot;
  items: ParsedItem[];
  matchedSavedMealId?: string;
}

export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const MEAL_KEYWORDS: { re: RegExp; meal: MealSlot }[] = [
  { re: /\bcafe da manha\b/, meal: "cafe" },
  { re: /\bno cafe\b/, meal: "cafe" },
  { re: /\balmoco\b/, meal: "almoco" },
  { re: /\bjantar\b/, meal: "jantar" },
  { re: /\blanche\b/, meal: "lanche" },
];

const UNIT_ALIASES: { re: RegExp; unit: Unit; gramsPerUnit?: number }[] = [
  { re: /^kg$/, unit: "g", gramsPerUnit: 1000 },
  { re: /^gramas?$/, unit: "g" },
  { re: /^g$/, unit: "g" },
  { re: /^litros?$/, unit: "ml", gramsPerUnit: 1000 },
  { re: /^l$/, unit: "ml", gramsPerUnit: 1000 },
  { re: /^ml$/, unit: "ml" },
  { re: /^unidades?$/, unit: "unidade" },
  { re: /^unid\.?$/, unit: "unidade" },
  { re: /^fatias?$/, unit: "unidade" },
  { re: /^colheres? de sopa$/, unit: "g", gramsPerUnit: 15 },
  { re: /^colheres?$/, unit: "g", gramsPerUnit: 15 },
  { re: /^xicaras?$/, unit: "g", gramsPerUnit: 120 },
  { re: /^copos?$/, unit: "ml", gramsPerUnit: 200 },
];

const LEADING_CONNECTORS = /^(de|do|da|dos|das|um|uma|o|a|os|as)\s+/;

function stripConnectors(s: string): string {
  let out = s.trim();
  let prev;
  do {
    prev = out;
    out = out.replace(LEADING_CONNECTORS, "").trim();
  } while (out !== prev);
  return out.replace(/^,|,$/g, "").trim();
}

interface QtyMatch {
  quantity: number;
  unit?: Unit;
  gramsPerUnit?: number;
  matchedText: string;
}

function extractQuantity(segment: string): QtyMatch | null {
  const re = /(\d+(?:[.,]\d+)?)\s*(kg|gramas?|g|litros?|l|ml|unidades?|unid\.?|fatias?|colheres? de sopa|colheres?|xicaras?|copos?)?/;
  const m = segment.match(re);
  if (!m) return null;
  const num = parseFloat(m[1].replace(",", "."));
  const unitWord = m[2];
  if (!unitWord) return { quantity: num, matchedText: m[0] };
  for (const u of UNIT_ALIASES) {
    if (u.re.test(unitWord)) {
      return { quantity: num, unit: u.unit, gramsPerUnit: u.gramsPerUnit, matchedText: m[0] };
    }
  }
  return { quantity: num, matchedText: m[0] };
}

function splitItems(text: string): string[] {
  return text
    .split(/,|(?:\s+e\s+)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

interface FoodMatch {
  food: Food;
  aliasLen: number;
}

function singularizeWord(w: string): string {
  if (w.endsWith("ns") && w.length > 3) return w.slice(0, -2) + "m";
  if (w.endsWith("s") && w.length > 3) return w.slice(0, -1);
  return w;
}

function coreForm(s: string): string {
  return s
    .replace(/[.,!?;:]+$/g, "")
    .trim()
    .split(/\s+/)
    .map(singularizeWord)
    .join(" ");
}

function findMatches(nameCandidate: string, foods: Food[]): FoodMatch[] {
  const q = coreForm(normalize(nameCandidate));
  if (!q) return [];
  const exact: FoodMatch[] = [];
  const partial: FoodMatch[] = [];
  for (const f of foods) {
    const names = [f.name, ...f.aliases].map((n) => coreForm(normalize(n)));
    for (const n of names) {
      if (n === q) {
        exact.push({ food: f, aliasLen: n.length });
        break;
      }
    }
  }
  if (exact.length) return dedupeBestPerFood(exact);
  for (const f of foods) {
    const names = [f.name, ...f.aliases].map((n) => coreForm(normalize(n)));
    for (const n of names) {
      if (q.includes(n) || n.includes(q)) {
        partial.push({ food: f, aliasLen: n.length });
        break;
      }
    }
  }
  return dedupeBestPerFood(partial);
}

function dedupeBestPerFood(matches: FoodMatch[]): FoodMatch[] {
  const byFood = new Map<string, FoodMatch>();
  for (const m of matches) {
    const prev = byFood.get(m.food.id);
    if (!prev || m.aliasLen > prev.aliasLen) byFood.set(m.food.id, m);
  }
  return [...byFood.values()];
}

function pickBest(matches: FoodMatch[]): { resolved?: Food; ambiguous?: Food[] } {
  if (matches.length === 0) return {};
  const personal = matches.filter((m) => m.food.isPersonal);
  const pool = personal.length > 0 ? personal : matches;
  const maxAliasLen = Math.max(...pool.map((m) => m.aliasLen));
  const top = pool.filter((m) => m.aliasLen === maxAliasLen);
  if (top.length === 1) return { resolved: top[0].food };
  const sorted = [...top].sort((a, b) => b.food.useCount - a.food.useCount);
  if (sorted[0].food.useCount > (sorted[1]?.food.useCount ?? -1)) {
    return { resolved: sorted[0].food };
  }
  return { ambiguous: sorted.map((m) => m.food) };
}

function buildItem(rawText: string, quantity: number, unit: Unit, food: Food): ParsedItem {
  const macros = macrosForQuantity(food, quantity);
  return {
    id: makeId(),
    rawText,
    quantity,
    unit,
    foodId: food.id,
    foodName: food.name,
    emoji: food.emoji,
    ...macros,
    isEstimate: false,
    source: food.isPersonal ? "personal" : "generic",
    status: "resolved",
  };
}

export function parseEntryText(text: string, foods: Food[], savedMeals: SavedMeal[] = []): ParseResult {
  const normalized = normalize(text);
  let meal: MealSlot = inferMealFromTime();
  let working = normalized;
  for (const mk of MEAL_KEYWORDS) {
    if (mk.re.test(working)) {
      meal = mk.meal;
      working = working.replace(mk.re, " ");
      break;
    }
  }
  working = working.replace(/^\s*(hoje|comi|no|na|eu comi)\b/g, " ").trim();

  const trimmedWorking = working.replace(/[.!?]+$/, "").trim();
  const savedMealMatch = savedMeals.find((m) => {
    const mn = normalize(m.name);
    return mn.length > 0 && (mn === trimmedWorking || trimmedWorking.includes(mn));
  });
  if (savedMealMatch) {
    return {
      meal,
      items: savedMealMatch.items.map((si) => ({
        id: makeId(),
        rawText: si.foodName,
        quantity: si.quantity,
        unit: si.unit,
        foodId: si.foodId,
        foodName: si.foodName,
        emoji: si.emoji,
        kcal: si.kcal,
        protein: si.protein,
        carbs: si.carbs,
        fat: si.fat,
        isEstimate: si.isEstimate,
        source: si.source,
        status: "resolved",
      })),
      matchedSavedMealId: savedMealMatch.id,
    };
  }

  const digitized = digitizeNumberWords(working);
  const segments = splitItems(digitized);

  const items: ParsedItem[] = [];
  for (const seg of segments) {
    const qty = extractQuantity(seg);
    let remainder = seg;
    let rawQuantity = 1;
    let rawUnit: Unit | undefined;
    let gramsPerUnit: number | undefined;
    if (qty) {
      remainder = seg.replace(qty.matchedText, " ");
      rawQuantity = qty.quantity;
      rawUnit = qty.unit;
      gramsPerUnit = qty.gramsPerUnit;
    }
    const nameCandidate = stripConnectors(remainder.replace(/\s+/g, " "));
    if (!nameCandidate) continue;

    const matches = findMatches(nameCandidate, foods);
    const { resolved, ambiguous } = pickBest(matches);

    if (ambiguous) {
      items.push({
        id: makeId(),
        rawText: seg.trim(),
        quantity: rawQuantity,
        unit: rawUnit ?? "unidade",
        foodName: nameCandidate,
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        isEstimate: false,
        source: "estimate",
        status: "ambiguous",
        candidates: ambiguous,
      });
      continue;
    }

    if (!resolved) {
      items.push({
        id: makeId(),
        rawText: seg.trim(),
        quantity: rawQuantity,
        unit: rawUnit ?? "g",
        foodName: nameCandidate,
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        isEstimate: true,
        source: "estimate",
        status: "unresolved",
      });
      continue;
    }

    let finalQuantity = rawQuantity;
    let finalUnit: Unit = rawUnit ?? resolved.unit;

    if (rawUnit && (rawUnit === "g" || rawUnit === "ml") && resolved.basis === "perUnit") {
      const grams = gramsPerUnit ? rawQuantity * gramsPerUnit : rawQuantity;
      finalQuantity = round2(grams / resolved.refAmount);
      finalUnit = "unidade";
    } else if (!rawUnit && resolved.basis === "perUnit") {
      finalUnit = "unidade";
    } else if (!rawUnit && resolved.basis === "per100") {
      finalUnit = resolved.unit;
      if (!qty) finalQuantity = 100;
    } else if (rawUnit === "unidade" && resolved.basis === "per100") {
      finalQuantity = rawQuantity * resolved.refAmount;
      finalUnit = resolved.unit;
    } else if (gramsPerUnit && resolved.basis === "per100") {
      finalQuantity = rawQuantity * gramsPerUnit;
      finalUnit = resolved.unit;
    }

    items.push(buildItem(seg.trim(), finalQuantity, finalUnit, resolved));
  }

  return { meal, items };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
