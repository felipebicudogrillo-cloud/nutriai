import { useState } from "react";
import type { ParsedItem } from "../../nlp/parser";
import type { Food, MealSlot } from "../../types";
import { MEAL_LABELS } from "../../types";
import { round1, sumTotals } from "../../lib/calc";
import { FoodPicker } from "../food/FoodPicker";
import { FoodEditor } from "../food/FoodEditor";
import { NumberInput } from "../shared/NumberInput";
import { useApp } from "../../state/AppContext";

interface Props {
  items: ParsedItem[];
  meal: MealSlot;
  onChangeMeal: (meal: MealSlot) => void;
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onResolve: (id: string, food: Food) => void;
  onAddFood: (food: Food) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const MEAL_OPTIONS: MealSlot[] = ["cafe", "almoco", "lanche", "jantar", "outro"];

type CreationTarget = { kind: "resolve"; item: ParsedItem } | { kind: "add" };

export function ConfirmationCard({
  items,
  meal,
  onChangeMeal,
  onChangeQuantity,
  onRemove,
  onResolve,
  onAddFood,
  onConfirm,
  onCancel,
}: Props) {
  const { data } = useApp();
  const [pickerFor, setPickerFor] = useState<ParsedItem | null>(null);
  const [addPickerOpen, setAddPickerOpen] = useState(false);
  const [creation, setCreation] = useState<{ target: CreationTarget; name: string } | null>(null);

  const totals = sumTotals(items.filter((i) => i.status === "resolved"));
  const pending = items.some((i) => i.status !== "resolved");
  const canConfirm = items.length > 0 && !pending;

  return (
    <div className="fixed inset-0 z-50 bg-ink-50 overflow-y-auto">
      <div className="max-w-md mx-auto px-4 pt-6 pb-32">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onCancel} className="text-ink-400 text-sm font-medium">
            Cancelar
          </button>
          <select
            className="text-sm font-semibold text-ink-800 bg-transparent text-right"
            value={meal}
            onChange={(e) => onChangeMeal(e.target.value as MealSlot)}
          >
            {MEAL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {MEAL_LABELS[m]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl2 shadow-card p-4">
              {item.status === "resolved" && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji ?? "🍽️"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-900 truncate">{item.foodName}</p>
                    <p className="text-xs text-ink-400">
                      {Math.round(item.kcal)} kcal · {item.protein}g proteína
                      {item.source === "personal" && <span className="text-brand-600 font-semibold"> · MEU</span>}
                    </p>
                  </div>
                  <NumberInput
                    className="w-16 rounded-lg border border-ink-200 px-2 py-1.5 text-sm text-center"
                    value={item.quantity}
                    step={item.unit === "unidade" ? 0.5 : 1}
                    onChange={(v) => onChangeQuantity(item.id, v)}
                  />
                  <span className="text-xs text-ink-400 w-10">{item.unit === "unidade" ? "un." : item.unit}</span>
                  <button onClick={() => onRemove(item.id)} className="text-ink-300 hover:text-red-500 px-1">
                    ✕
                  </button>
                </div>
              )}

              {item.status === "ambiguous" && (
                <div>
                  <p className="text-sm text-ink-700 mb-2">
                    Encontrei mais de um alimento para <strong>"{item.foodName}"</strong>. Qual deles?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.candidates?.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onResolve(item.id, c)}
                        className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-brand-500 hover:text-brand-600"
                      >
                        {c.emoji} {c.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setPickerFor(item)}
                      className="rounded-full border border-dashed border-ink-300 px-3 py-1.5 text-xs text-ink-500"
                    >
                      Outro...
                    </button>
                  </div>
                </div>
              )}

              {item.status === "unresolved" && (
                <div>
                  <p className="text-sm text-ink-700 mb-2">
                    Não conheço <strong>"{item.foodName}"</strong> ainda.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPickerFor(item)}
                      className="flex-1 rounded-lg border border-ink-200 py-2 text-xs font-medium text-ink-700"
                    >
                      Buscar alimento
                    </button>
                    <button
                      onClick={() => setCreation({ target: { kind: "resolve", item }, name: item.foodName })}
                      className="flex-1 rounded-lg bg-ink-900 text-white py-2 text-xs font-medium"
                    >
                      Criar personalizado
                    </button>
                    <button onClick={() => onRemove(item.id)} className="text-ink-300 hover:text-red-500 px-1">
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setAddPickerOpen(true)}
          className="w-full mb-4 rounded-xl border border-dashed border-ink-300 text-ink-500 text-sm font-medium py-2.5"
        >
          + Adicionar outro alimento
        </button>

        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-ink-100 safe-bottom">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-ink-500">Total</span>
              <span className="font-semibold text-ink-900">
                🔥 {Math.round(totals.kcal)} kcal · 💪 {round1(totals.protein)}g · 🍚 {round1(totals.carbs)}g · 🥑 {round1(totals.fat)}g · 🍬 {round1(totals.sugar)}g
              </span>
            </div>
            <button
              onClick={onConfirm}
              disabled={!canConfirm}
              className="w-full rounded-xl bg-brand-500 disabled:opacity-40 text-white font-semibold py-3 active:scale-[0.98] transition-transform"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <FoodPicker
        open={!!pickerFor}
        onClose={() => setPickerFor(null)}
        foods={data.foods}
        presetCandidates={pickerFor?.candidates}
        initialQuery={pickerFor?.status === "unresolved" ? pickerFor.foodName : ""}
        onPick={(f) => pickerFor && onResolve(pickerFor.id, f)}
        onCreateNew={(name) =>
          pickerFor && setCreation({ target: { kind: "resolve", item: pickerFor }, name: name || pickerFor.foodName })
        }
      />

      <FoodPicker
        open={addPickerOpen}
        onClose={() => setAddPickerOpen(false)}
        foods={data.foods}
        onPick={(f) => onAddFood(f)}
        onCreateNew={(name) => setCreation({ target: { kind: "add" }, name })}
      />

      <FoodEditor
        open={creation !== null}
        onClose={() => setCreation(null)}
        initialName={creation?.name ?? ""}
        onSaved={(food) => {
          if (!creation) return;
          if (creation.target.kind === "resolve") onResolve(creation.target.item.id, food);
          else onAddFood(food);
        }}
      />
    </div>
  );
}
