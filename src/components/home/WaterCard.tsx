import { useApp } from "../../state/AppContext";
import { sumWater, waterForDay } from "../../lib/calc";
import { ProgressBar } from "../shared/ProgressBar";

const QUICK_ADD = [200, 330, 500];

interface Props {
  date: string;
}

export function WaterCard({ date }: Props) {
  const { data, addWater, deleteWaterEntry } = useApp();
  const entries = waterForDay(data.waterEntries, date);
  const total = sumWater(entries);
  const goal = data.goals.water ?? 2000;

  return (
    <section className="bg-white rounded-xl2 shadow-card p-5 mb-4">
      <div className="flex items-end justify-between mb-2">
        <p className="text-xl font-bold text-ink-900 tabular-nums">
          {total}
          <span className="text-sm font-medium text-ink-400"> / {goal} ml água</span>
        </p>
        <span className="text-2xl">💧</span>
      </div>
      <ProgressBar value={total} goal={goal} color="bg-sky-500" />

      <div className="mt-4 flex gap-2">
        {QUICK_ADD.map((ml) => (
          <button
            key={ml}
            onClick={() => addWater(date, ml)}
            className="flex-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-700 text-sm font-medium py-2"
          >
            + {ml}ml
          </button>
        ))}
      </div>

      {entries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entries.map((e) => (
            <button
              key={e.id}
              onClick={() => deleteWaterEntry(e.id)}
              className="text-xs text-ink-400 bg-ink-50 rounded-full px-2.5 py-1"
              title="Toque para remover"
            >
              {e.amountMl}ml ✕
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
