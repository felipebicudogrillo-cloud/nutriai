import { useState } from "react";
import { useApp } from "../../state/AppContext";
import type { Food } from "../../types";
import { FoodEditor } from "../food/FoodEditor";

export function MyMemoryCard() {
  const { personalFoods, deleteCustomFood } = useApp();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  return (
    <div className="bg-white rounded-xl2 shadow-card p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-ink-900">Minha memória</h2>
        <button
          onClick={() => {
            setEditingFood(null);
            setEditorOpen(true);
          }}
          className="text-xs font-medium text-brand-600"
        >
          + Criar alimento
        </button>
      </div>
      <p className="text-xs text-ink-400 mb-3">Alimentos e apelidos que você ensinou ao app.</p>

      {personalFoods.length === 0 ? (
        <p className="text-sm text-ink-400 py-4 text-center">Nenhum alimento personalizado ainda.</p>
      ) : (
        <ul className="divide-y divide-ink-100">
          {personalFoods.map((f) => (
            <li key={f.id} className="flex items-center gap-3 py-2.5">
              <span className="text-xl">{f.emoji ?? "🍽️"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-800 truncate">
                  {f.name}
                  {f.brand && <span className="text-ink-400 font-normal"> · {f.brand}</span>}
                </p>
                <p className="text-xs text-ink-400 truncate">
                  {f.kcal} kcal {f.basis === "perUnit" ? "/ unidade" : "/ 100g"}
                  {f.aliases.length > 0 && ` · apelidos: ${f.aliases.join(", ")}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingFood(f);
                  setEditorOpen(true);
                }}
                className="text-ink-400 hover:text-ink-700 px-1"
              >
                ✏️
              </button>
              <button onClick={() => deleteCustomFood(f.id)} className="text-ink-400 hover:text-red-500 px-1">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <FoodEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        editingFood={editingFood}
      />
    </div>
  );
}
