import { useMemo, useState } from "react";
import type { Food } from "../../types";
import { Modal } from "../shared/Modal";
import { normalize } from "../../nlp/parser";

interface Props {
  open: boolean;
  onClose: () => void;
  foods: Food[];
  presetCandidates?: Food[];
  initialQuery?: string;
  onPick: (food: Food) => void;
  onCreateNew: (name: string) => void;
}

export function FoodPicker({ open, onClose, foods, presetCandidates, initialQuery, onPick, onCreateNew }: Props) {
  const [query, setQuery] = useState(initialQuery ?? "");

  const results = useMemo(() => {
    if (presetCandidates && !query) return presetCandidates;
    const q = normalize(query);
    if (!q) return foods.filter((f) => f.isPersonal).slice(0, 8);
    return foods
      .filter((f) => normalize(f.name).includes(q) || f.aliases.some((a) => normalize(a).includes(q)))
      .slice(0, 20);
  }, [foods, query, presetCandidates]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Qual alimento?">
      <input
        autoFocus
        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm mb-3"
        placeholder="Buscar alimento..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="max-h-72 overflow-y-auto -mx-1 space-y-1">
        {results.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              onPick(f);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ink-50 text-left"
          >
            <span className="text-xl">{f.emoji ?? "🍽️"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-800 truncate">
                {f.name}
                {f.isPersonal && <span className="ml-1.5 text-[10px] text-brand-600 font-semibold">MEU</span>}
              </p>
              <p className="text-xs text-ink-400">
                {f.kcal} kcal {f.basis === "perUnit" ? "/ unidade" : "/ 100g"}
              </p>
            </div>
          </button>
        ))}
        {results.length === 0 && (
          <p className="text-sm text-ink-400 text-center py-4">Nenhum alimento encontrado.</p>
        )}
      </div>
      <button
        onClick={() => {
          onCreateNew(query);
          onClose();
        }}
        className="w-full mt-3 rounded-xl border border-dashed border-ink-300 text-ink-600 font-medium py-2.5 text-sm"
      >
        + Criar alimento personalizado
      </button>
    </Modal>
  );
}
