import { useEffect, useState } from "react";
import type { LogEntry, MealSlot } from "../../types";
import { MEAL_LABELS } from "../../types";
import { Modal } from "../shared/Modal";
import { NumberInput } from "../shared/NumberInput";
import { useApp } from "../../state/AppContext";
import { macrosForQuantity } from "../../lib/calc";

interface Props {
  entry: LogEntry | null;
  onClose: () => void;
}

const MEAL_OPTIONS: MealSlot[] = ["cafe", "almoco", "lanche", "jantar", "outro"];

export function EditEntryModal({ entry, onClose }: Props) {
  const { data, updateEntry, deleteEntry } = useApp();
  const [quantity, setQuantity] = useState(entry?.quantity ?? 0);
  const [meal, setMeal] = useState<MealSlot>(entry?.meal ?? "outro");
  const [manual, setManual] = useState({
    kcal: entry?.kcal ?? 0,
    protein: entry?.protein ?? 0,
    carbs: entry?.carbs ?? 0,
    fat: entry?.fat ?? 0,
    sugar: entry?.sugar ?? 0,
  });

  useEffect(() => {
    if (entry) {
      setQuantity(entry.quantity);
      setMeal(entry.meal);
      setManual({ kcal: entry.kcal, protein: entry.protein, carbs: entry.carbs, fat: entry.fat, sugar: entry.sugar });
    }
  }, [entry]);

  if (!entry) return null;

  const food = entry.foodId ? data.foods.find((f) => f.id === entry.foodId) : undefined;
  const preview = food ? macrosForQuantity(food, quantity) : manual;

  function save() {
    if (!entry) return;
    updateEntry(entry.id, { quantity, meal, ...preview });
    onClose();
  }

  function remove() {
    if (!entry) return;
    deleteEntry(entry.id);
    onClose();
  }

  return (
    <Modal open={!!entry} onClose={onClose} title={entry.foodName}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-ink-500 mb-1 block">
            Quantidade {entry.unit === "unidade" ? "(unidades)" : `(${entry.unit})`}
          </label>
          <NumberInput
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            value={quantity}
            step={entry.unit === "unidade" ? 0.5 : 1}
            onChange={setQuantity}
          />
        </div>

        {!food && (
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Calorias" value={manual.kcal} onChange={(v) => setManual((m) => ({ ...m, kcal: v }))} />
            <NumField label="Proteína (g)" value={manual.protein} onChange={(v) => setManual((m) => ({ ...m, protein: v }))} />
            <NumField label="Carboidratos (g)" value={manual.carbs} onChange={(v) => setManual((m) => ({ ...m, carbs: v }))} />
            <NumField label="Gordura (g)" value={manual.fat} onChange={(v) => setManual((m) => ({ ...m, fat: v }))} />
            <NumField label="Açúcar (g)" value={manual.sugar} onChange={(v) => setManual((m) => ({ ...m, sugar: v }))} />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-ink-500 mb-1 block">Refeição</label>
          <select
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm bg-white"
            value={meal}
            onChange={(e) => setMeal(e.target.value as MealSlot)}
          >
            {MEAL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {MEAL_LABELS[m]}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
          🔥 {Math.round(preview.kcal)} kcal · 💪 {preview.protein}g · 🍚 {preview.carbs}g · 🥑 {preview.fat}g · 🍬 {preview.sugar}g
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={remove}
            className="flex-1 rounded-xl border border-red-200 text-red-500 font-medium py-2.5 text-sm"
          >
            Remover
          </button>
          <button
            onClick={save}
            className="flex-1 rounded-xl bg-brand-500 text-white font-medium py-2.5 text-sm active:scale-[0.98] transition-transform"
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-500 mb-1 block">{label}</label>
      <NumberInput className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm" value={value} onChange={onChange} />
    </div>
  );
}
