import type { Goals, LogEntry } from "../../types";
import { sumTotals } from "../../lib/calc";
import { MEAL_LABELS } from "../../types";
import { MacroRow } from "../shared/MacroRow";

interface Props {
  meal: LogEntry["meal"];
  entries: LogEntry[];
  goals: Goals;
  onDelete: (id: string) => void;
  onEdit: (entry: LogEntry) => void;
}

export function MealGroup({ meal, entries, goals, onDelete, onEdit }: Props) {
  if (entries.length === 0) return null;
  const totals = sumTotals(entries);
  const impactPct = goals.kcal > 0 ? Math.round((totals.kcal / goals.kcal) * 100) : 0;

  return (
    <div className="bg-white rounded-xl2 shadow-card p-4">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-semibold text-ink-900">{MEAL_LABELS[meal]}</h3>
        <MacroRow {...totals} />
      </div>
      {impactPct >= 30 && (
        <p className="text-xs text-ink-400 mb-2">
          Esta refeição representa aproximadamente {impactPct}% da sua meta diária de calorias.
        </p>
      )}
      <ul className="mt-2 divide-y divide-ink-100">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center gap-3 py-2 group">
            <span className="text-xl">{e.emoji ?? "🍽️"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-800 truncate">
                {e.foodName}
                {e.isEstimate && <span className="text-ink-400 font-normal"> · estimativa</span>}
              </p>
              <p className="text-xs text-ink-400">
                {formatQty(e.quantity, e.unit)} · {Math.round(e.kcal)} kcal
              </p>
            </div>
            <button
              onClick={() => onEdit(e)}
              className="opacity-0 group-hover:opacity-100 sm:opacity-60 text-ink-400 hover:text-ink-700 px-1.5"
              aria-label="Editar"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(e.id)}
              className="opacity-0 group-hover:opacity-100 sm:opacity-60 text-ink-400 hover:text-red-500 px-1.5"
              aria-label="Remover"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatQty(quantity: number, unit: string) {
  if (unit === "unidade") {
    return quantity === 1 ? "1 unidade" : `${trimNum(quantity)} unidades`;
  }
  return `${trimNum(quantity)}${unit}`;
}

function trimNum(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
