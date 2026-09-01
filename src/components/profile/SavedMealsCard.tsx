import { useState } from "react";
import { useApp } from "../../state/AppContext";
import type { SavedMeal } from "../../types";
import { sumTotals } from "../../lib/calc";
import { SavedMealEditor } from "./SavedMealEditor";

export function SavedMealsCard() {
  const { data, deleteSavedMeal } = useApp();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SavedMeal | null>(null);

  return (
    <div className="bg-white rounded-xl2 shadow-card p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-ink-900">Refeições salvas</h2>
        <button
          onClick={() => {
            setEditing(null);
            setEditorOpen(true);
          }}
          className="text-xs font-medium text-brand-600"
        >
          + Nova
        </button>
      </div>
      <p className="text-xs text-ink-400 mb-3">Diga o nome dela (ex: "comi meu almoço") para registrar tudo de uma vez.</p>

      {data.savedMeals.length === 0 ? (
        <p className="text-sm text-ink-400 py-4 text-center">Nenhuma refeição salva ainda.</p>
      ) : (
        <ul className="divide-y divide-ink-100">
          {data.savedMeals.map((m) => {
            const totals = sumTotals(m.items);
            return (
              <li key={m.id} className="flex items-center gap-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-800 truncate">{m.name}</p>
                  <p className="text-xs text-ink-400 truncate">
                    {Math.round(totals.kcal)} kcal · {m.items.map((i) => i.foodName).join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditing(m);
                    setEditorOpen(true);
                  }}
                  className="text-ink-400 hover:text-ink-700 px-1"
                >
                  ✏️
                </button>
                <button onClick={() => deleteSavedMeal(m.id)} className="text-ink-400 hover:text-red-500 px-1">
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <SavedMealEditor open={editorOpen} onClose={() => setEditorOpen(false)} editing={editing} />
    </div>
  );
}
