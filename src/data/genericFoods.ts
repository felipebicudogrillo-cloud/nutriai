import type { Food } from "../types";

type Seed = Omit<Food, "id" | "isPersonal" | "createdAt" | "useCount">;

// Macro values are approximate per 100g/100ml (basis "per100") or per single
// unit (basis "perUnit"). Sourced from typical Brazilian food-composition
// references (TACO-style averages) — meant as reasonable defaults, not lab-grade.
const seeds: Seed[] = [
  { name: "Peito de frango grelhado", aliases: ["frango", "peito de frango", "frango grelhado"], unit: "g", basis: "per100", refAmount: 100, kcal: 165, protein: 31, carbs: 0, fat: 3.6, emoji: "🍗" },
  { name: "Coxa de frango assada", aliases: ["coxa de frango", "sobrecoxa"], unit: "g", basis: "per100", refAmount: 100, kcal: 209, protein: 26, carbs: 0, fat: 11, emoji: "🍗" },
  { name: "Arroz branco cozido", aliases: ["arroz", "arroz branco"], unit: "g", basis: "per100", refAmount: 100, kcal: 128, protein: 2.5, carbs: 28, fat: 0.2, emoji: "🍚" },
  { name: "Arroz integral cozido", aliases: ["arroz integral"], unit: "g", basis: "per100", refAmount: 100, kcal: 124, protein: 2.6, carbs: 25.8, fat: 1, emoji: "🍚" },
  { name: "Feijão carioca cozido", aliases: ["feijão", "feijao"], unit: "g", basis: "per100", refAmount: 100, kcal: 76, protein: 4.8, carbs: 13.6, fat: 0.5, emoji: "🫘" },
  { name: "Carne bovina moída (patinho)", aliases: ["carne moída", "carne moida", "patinho", "carne bovina"], unit: "g", basis: "per100", refAmount: 100, kcal: 172, protein: 26, carbs: 0, fat: 7, emoji: "🥩" },
  { name: "Bife grelhado (alcatra)", aliases: ["bife", "alcatra", "carne grelhada"], unit: "g", basis: "per100", refAmount: 100, kcal: 200, protein: 32, carbs: 0, fat: 7.5, emoji: "🥩" },
  { name: "Ovo cozido", aliases: ["ovo", "ovos", "ovo cozido"], unit: "unidade", basis: "perUnit", refAmount: 50, kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, emoji: "🥚" },
  { name: "Ovo mexido", aliases: ["ovo mexido", "ovos mexidos"], unit: "unidade", basis: "perUnit", refAmount: 50, kcal: 92, protein: 6.1, carbs: 0.8, fat: 7, emoji: "🍳" },
  { name: "Batata inglesa cozida", aliases: ["batata", "batata cozida", "batata inglesa"], unit: "unidade", basis: "perUnit", refAmount: 150, kcal: 130.5, protein: 2.9, carbs: 30, fat: 0.15, emoji: "🥔" },
  { name: "Batata doce cozida", aliases: ["batata doce"], unit: "unidade", basis: "perUnit", refAmount: 130, kcal: 111.8, protein: 2.1, carbs: 26, fat: 0.13, emoji: "🍠" },
  { name: "Macarrão cozido", aliases: ["macarrão", "macarrao", "massa"], unit: "g", basis: "per100", refAmount: 100, kcal: 158, protein: 5.8, carbs: 31, fat: 0.9, emoji: "🍝" },
  { name: "Pão francês", aliases: ["pão francês", "pao frances", "pão", "pao"], unit: "unidade", basis: "perUnit", refAmount: 50, kcal: 135, protein: 4.3, carbs: 28, fat: 0.8, emoji: "🥖" },
  { name: "Pão de forma (fatia)", aliases: ["pão de forma", "fatia de pão", "torrada"], unit: "unidade", basis: "perUnit", refAmount: 25, kcal: 67, protein: 2.3, carbs: 12.5, fat: 0.9, emoji: "🍞" },
  { name: "Tapioca", aliases: ["tapioca"], unit: "unidade", basis: "perUnit", refAmount: 60, kcal: 108, protein: 0, carbs: 26, fat: 0, emoji: "🫓" },
  { name: "Banana", aliases: ["banana"], unit: "unidade", basis: "perUnit", refAmount: 100, kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, emoji: "🍌" },
  { name: "Maçã", aliases: ["maçã", "maca"], unit: "unidade", basis: "perUnit", refAmount: 130, kcal: 68, protein: 0.3, carbs: 18, fat: 0.2, emoji: "🍎" },
  { name: "Laranja", aliases: ["laranja"], unit: "unidade", basis: "perUnit", refAmount: 150, kcal: 70, protein: 1.4, carbs: 17.5, fat: 0.2, emoji: "🍊" },
  { name: "Mamão", aliases: ["mamão", "mamao"], unit: "g", basis: "per100", refAmount: 100, kcal: 43, protein: 0.5, carbs: 11, fat: 0.1, emoji: "🥭" },
  { name: "Morango", aliases: ["morango", "morangos"], unit: "g", basis: "per100", refAmount: 100, kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3, emoji: "🍓" },
  { name: "Abacate", aliases: ["abacate"], unit: "g", basis: "per100", refAmount: 100, kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, emoji: "🥑" },
  { name: "Iogurte natural", aliases: ["iogurte natural", "iogurte"], unit: "unidade", basis: "perUnit", refAmount: 170, kcal: 100, protein: 5.9, carbs: 7.8, fat: 5.1, emoji: "🥣" },
  { name: "Iogurte grego", aliases: ["iogurte grego"], unit: "unidade", basis: "perUnit", refAmount: 100, kcal: 97, protein: 9, carbs: 4, fat: 5, emoji: "🥣" },
  { name: "Leite integral", aliases: ["leite", "leite integral"], unit: "ml", basis: "per100", refAmount: 100, kcal: 61, protein: 3.2, carbs: 4.5, fat: 3.3, emoji: "🥛" },
  { name: "Whey protein (dose)", aliases: ["whey", "whey protein"], unit: "unidade", basis: "perUnit", refAmount: 30, kcal: 120, protein: 24, carbs: 3, fat: 1.5, emoji: "🥤" },
  { name: "Aveia em flocos", aliases: ["aveia"], unit: "g", basis: "per100", refAmount: 100, kcal: 389, protein: 13.9, carbs: 66.3, fat: 6.9, emoji: "🌾" },
  { name: "Azeite de oliva", aliases: ["azeite"], unit: "ml", basis: "per100", refAmount: 100, kcal: 884, protein: 0, carbs: 0, fat: 100, emoji: "🫒" },
  { name: "Queijo minas", aliases: ["queijo minas", "queijo"], unit: "g", basis: "per100", refAmount: 100, kcal: 264, protein: 17.4, carbs: 3.2, fat: 20.2, emoji: "🧀" },
  { name: "Queijo mussarela", aliases: ["mussarela", "muçarela"], unit: "g", basis: "per100", refAmount: 100, kcal: 280, protein: 22, carbs: 2.2, fat: 20, emoji: "🧀" },
  { name: "Tomate", aliases: ["tomate"], unit: "unidade", basis: "perUnit", refAmount: 120, kcal: 21.6, protein: 1.1, carbs: 4.7, fat: 0.24, emoji: "🍅" },
  { name: "Alface", aliases: ["alface"], unit: "g", basis: "per100", refAmount: 100, kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, emoji: "🥬" },
  { name: "Brócolis cozido", aliases: ["brócolis", "brocolis"], unit: "g", basis: "per100", refAmount: 100, kcal: 35, protein: 2.4, carbs: 7.2, fat: 0.4, emoji: "🥦" },
  { name: "Cenoura", aliases: ["cenoura"], unit: "unidade", basis: "perUnit", refAmount: 60, kcal: 24.6, protein: 0.5, carbs: 5.8, fat: 0.12, emoji: "🥕" },
  { name: "Amendoim", aliases: ["amendoim"], unit: "g", basis: "per100", refAmount: 100, kcal: 567, protein: 25.8, carbs: 16.1, fat: 49.2, emoji: "🥜" },
  { name: "Castanha do Pará", aliases: ["castanha", "castanha do pará", "castanha do para"], unit: "g", basis: "per100", refAmount: 100, kcal: 656, protein: 14.3, carbs: 12.3, fat: 66.4, emoji: "🌰" },
  { name: "Atum enlatado", aliases: ["atum"], unit: "g", basis: "per100", refAmount: 100, kcal: 116, protein: 25.5, carbs: 0, fat: 1, emoji: "🐟" },
  { name: "Salmão grelhado", aliases: ["salmão", "salmao"], unit: "g", basis: "per100", refAmount: 100, kcal: 208, protein: 20, carbs: 0, fat: 13, emoji: "🐟" },
  { name: "Tilápia grelhada", aliases: ["tilápia", "tilapia", "peixe"], unit: "g", basis: "per100", refAmount: 100, kcal: 128, protein: 26, carbs: 0, fat: 2.7, emoji: "🐟" },
  { name: "Café com leite", aliases: ["café", "cafe", "café com leite"], unit: "unidade", basis: "perUnit", refAmount: 200, kcal: 60, protein: 3, carbs: 6, fat: 2.5, emoji: "☕" },
  { name: "Açúcar", aliases: ["açúcar", "acucar"], unit: "g", basis: "per100", refAmount: 100, kcal: 387, protein: 0, carbs: 100, fat: 0, emoji: "🍬" },
  { name: "Mel", aliases: ["mel"], unit: "g", basis: "per100", refAmount: 100, kcal: 304, protein: 0.3, carbs: 82.4, fat: 0, emoji: "🍯" },
  { name: "Manteiga", aliases: ["manteiga"], unit: "g", basis: "per100", refAmount: 100, kcal: 717, protein: 0.9, carbs: 0.1, fat: 81.1, emoji: "🧈" },
  { name: "Granola", aliases: ["granola"], unit: "g", basis: "per100", refAmount: 100, kcal: 471, protein: 10, carbs: 64, fat: 20, emoji: "🥣" },
  { name: "Pudim de leite", aliases: ["pudim"], unit: "unidade", basis: "perUnit", refAmount: 100, kcal: 150, protein: 4, carbs: 25, fat: 4, emoji: "🍮" },
  { name: "Chocolate ao leite", aliases: ["chocolate"], unit: "g", basis: "per100", refAmount: 100, kcal: 535, protein: 7.6, carbs: 59.6, fat: 29.7, emoji: "🍫" },
  { name: "Refrigerante", aliases: ["refrigerante", "coca", "coca-cola"], unit: "ml", basis: "per100", refAmount: 100, kcal: 42, protein: 0, carbs: 10.6, fat: 0, emoji: "🥤" },
];

export function buildGenericFoods(): Food[] {
  const now = new Date().toISOString();
  return seeds.map((s, i) => ({
    ...s,
    id: `generic-${i}`,
    isPersonal: false,
    createdAt: now,
    useCount: 0,
  }));
}
