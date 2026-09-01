import { useState } from "react";
import { useApp } from "../state/AppContext";
import { parseEntryText, type ParsedItem, type ParseResult } from "../nlp/parser";
import { macrosForQuantity } from "../lib/calc";
import { todayKey, inferMealFromTime as inferMealNow } from "../lib/date";
import type { Food, MealSlot } from "../types";
import { ConfirmationCard } from "../components/register/ConfirmationCard";
import { VoiceButton } from "../components/register/VoiceButton";
import { makeId } from "../lib/id";

interface Props {
  onDone: () => void;
}

const EXAMPLES = [
  "200g de peito de frango, 150g de arroz e uma banana",
  "No almoço comi 250g de frango, 100g de arroz e 50g de feijão",
  "Comi meu pudim do Mercadona",
];

export function RegisterScreen({ onDone }: Props) {
  const { data, addEntries, touchSavedMealUsage } = useApp();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);

  const recentFoods = [...data.foods]
    .filter((f) => f.lastUsedAt)
    .sort((a, b) => (b.lastUsedAt! < a.lastUsedAt! ? -1 : 1))
    .slice(0, 6);

  function handleParse() {
    if (!text.trim()) return;
    setResult(parseEntryText(text, data.foods, data.savedMeals));
  }

  function handleQuickAdd(food: Food) {
    setResult({ meal: inferMealNow(), items: [itemFromFood(food, food.name)] });
  }

  function itemFromFood(food: Food, rawText: string): ParsedItem {
    const quantity = food.basis === "perUnit" ? 1 : 100;
    const macros = macrosForQuantity(food, quantity);
    return {
      id: makeId(),
      rawText,
      quantity,
      unit: food.basis === "perUnit" ? "unidade" : food.unit,
      foodId: food.id,
      foodName: food.name,
      emoji: food.emoji,
      ...macros,
      isEstimate: false,
      source: food.isPersonal ? "personal" : "generic",
      status: "resolved",
    };
  }

  function updateItems(mutate: (items: ParsedItem[]) => ParsedItem[]) {
    setResult((r) => (r ? { ...r, items: mutate(r.items) } : r));
  }

  function handleChangeQuantity(id: string, quantity: number) {
    updateItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const food = data.foods.find((f) => f.id === item.foodId);
        if (!food) return { ...item, quantity };
        return { ...item, quantity, ...macrosForQuantity(food, quantity) };
      })
    );
  }

  function handleResolve(id: string, food: Food) {
    updateItems((items) =>
      items.map((item) => (item.id === id ? { ...itemFromFood(food, item.rawText), id: item.id } : item))
    );
  }

  function handleAddFood(food: Food) {
    updateItems((items) => [...items, itemFromFood(food, food.name)]);
  }

  function handleRemove(id: string) {
    updateItems((items) => items.filter((i) => i.id !== id));
  }

  function handleConfirm() {
    if (!result) return;
    const date = todayKey();
    addEntries(
      result.items
        .filter((i) => i.status === "resolved")
        .map((i) => ({
          date,
          meal: result.meal,
          foodId: i.foodId,
          foodName: i.foodName,
          emoji: i.emoji,
          quantity: i.quantity,
          unit: i.unit,
          kcal: i.kcal,
          protein: i.protein,
          carbs: i.carbs,
          fat: i.fat,
          isEstimate: i.isEstimate,
          source: i.source,
        }))
    );
    if (result.matchedSavedMealId) touchSavedMealUsage(result.matchedSavedMealId);
    setResult(null);
    setText("");
    onDone();
  }

  if (result) {
    return (
      <ConfirmationCard
        items={result.items}
        meal={result.meal}
        onChangeMeal={(meal: MealSlot) => setResult((r) => (r ? { ...r, meal } : r))}
        onChangeQuantity={handleChangeQuantity}
        onRemove={handleRemove}
        onResolve={handleResolve}
        onAddFood={handleAddFood}
        onConfirm={handleConfirm}
        onCancel={() => setResult(null)}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-8 pb-28 min-h-[80vh] flex flex-col">
      <h1 className="text-2xl font-bold text-ink-900 mb-1">O que você comeu?</h1>
      <p className="text-sm text-ink-400 mb-5">Digite ou fale naturalmente. Eu entendo o resto.</p>

      <div className="bg-white rounded-xl2 shadow-card p-3 flex items-end gap-2 mb-4">
        <textarea
          className="flex-1 resize-none outline-none text-base text-ink-900 placeholder:text-ink-300 min-h-[88px] p-2"
          placeholder="Ex: comi 200g de frango, 150g de arroz e uma banana"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <VoiceButton onResult={(t) => setText((prev) => (prev ? `${prev} ${t}` : t))} />
      </div>

      <button
        onClick={handleParse}
        disabled={!text.trim()}
        className="w-full rounded-xl bg-brand-500 disabled:opacity-40 text-white font-semibold py-3.5 mb-6 active:scale-[0.98] transition-transform"
      >
        Continuar
      </button>

      {recentFoods.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-ink-400 mb-2">RECENTES</p>
          <div className="flex flex-wrap gap-2">
            {recentFoods.map((f) => (
              <button
                key={f.id}
                onClick={() => handleQuickAdd(f)}
                className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700"
              >
                <span>{f.emoji ?? "🍽️"}</span> {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-ink-400 mb-2">EXEMPLOS</p>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setText(ex)}
              className="text-left text-sm text-ink-500 bg-ink-100/70 rounded-lg px-3 py-2 hover:bg-ink-100"
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
