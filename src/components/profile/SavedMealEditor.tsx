import { useEffect, useState } from "react";
import type { Food, SavedMeal, SavedMealItem } from "../../types";
import { Modal } from "../shared/Modal";
import { FoodPicker } from "../food/FoodPicker";
import { NumberInput } from "../shared/NumberInput";
import { useApp } from "../../state/AppContext";
import { macrosForQuantity } from "../../lib/calc";

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: SavedMeal | null;
}

export function SavedMealEditor({ open, onClose, editing }: Props) {
  const { data, addSavedMeal, updateSavedMeal } = useApp();
  const [name, setName] = useState("");
  const [items, setItems] = useState<SavedMealItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setItems(editing?.items ?? []);
    }
  }, [open, editing]);

  if (!open) return null;

  function addFood(food: Food) {
    const quantity = food.basis === "perUnit" ? 1 : 100;
    const macros = macrosForQuantity(food, quantity);
    setItems((prev) => [
      ...prev,
      {
        foodId: food.id,
        foodName: food.name,
        emoji: food.emoji,
        quantity,
        unit: food.basis === "perUnit" ? "unidade" : food.unit,
        ...macros,
        isEstimate: false,
        source: food.isPersonal ? "personal" : "generic",
      },
    ]);
  }

  function changeQuantity(index: number, quantity: number) {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const food = data.foods.find((f) => f.id === it.foodId);
        if (!food) return { ...it, quantity };
        return { ...it, quantity, ...macrosForQuantity(food, quantity) };
      })
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function save() {
    if (!name.trim() || items.length === 0) return;
    if (editing) {
      updateSavedMeal(editing.id, { name: name.trim(), items });
    } else {
      addSavedMeal({ name: name.trim(), items });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Editar refeição salva" : "Nova refeição salva"}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-ink-500 mb-1 block">Nome</label>
          <input
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            placeholder="Ex: Meu almoço"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-2 bg-ink-50 rounded-lg px-3 py-2">
              <span>{it.emoji ?? "🍽️"}</span>
              <span className="flex-1 text-sm text-ink-700 truncate">{it.foodName}</span>
              <NumberInput
                className="w-14 rounded border border-ink-200 px-1.5 py-1 text-xs text-center"
                value={it.quantity}
                onChange={(v) => changeQuantity(i, v)}
              />
              <span className="text-[11px] text-ink-400 w-8">{it.unit === "unidade" ? "un." : it.unit}</span>
              <button onClick={() => removeItem(i)} className="text-ink-300 hover:text-red-500">
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="w-full rounded-xl border border-dashed border-ink-300 text-ink-500 text-sm font-medium py-2.5"
        >
          + Adicionar alimento
        </button>

        <button
          onClick={save}
          disabled={!name.trim() || items.length === 0}
          className="w-full rounded-xl bg-brand-500 disabled:opacity-40 text-white font-medium py-2.5 text-sm"
        >
          Salvar refeição
        </button>
      </div>

      <FoodPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        foods={data.foods}
        onPick={addFood}
        onCreateNew={() => setPickerOpen(false)}
      />
    </Modal>
  );
}
