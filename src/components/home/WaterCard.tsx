import { useEffect, useState } from "react";
import { useApp } from "../../state/AppContext";
import { sumWater, waterForDay } from "../../lib/calc";

interface Props {
  date: string;
}

const STEP = 50;

export function WaterCard({ date }: Props) {
  const { data, setWaterForDay } = useApp();
  const entries = waterForDay(data.waterEntries, date);
  const total = sumWater(entries);
  const goal = data.goals.water ?? 2000;
  const max = Math.max(goal * 1.5, total, 500);

  // Local state drives the visual slider on every drag step (cheap, instant).
  // The global store — and the heavier app-wide re-render it triggers — only
  // gets updated once the user releases, so dragging never feels laggy.
  const [dragValue, setDragValue] = useState(total);
  useEffect(() => {
    setDragValue(total);
  }, [total]);

  const pct = Math.min(100, (dragValue / max) * 100);

  function commit(value: number) {
    setWaterForDay(date, value);
  }

  return (
    <section className="bg-white rounded-xl2 shadow-card p-5 mb-4">
      <div className="flex items-end justify-between mb-3">
        <p className="text-xl font-bold text-ink-900 tabular-nums">
          {dragValue}
          <span className="text-sm font-medium text-ink-400"> / {goal} ml água</span>
        </p>
        <span className="text-2xl">💧</span>
      </div>

      <input
        type="range"
        min={0}
        max={Math.ceil(max / STEP) * STEP}
        step={STEP}
        value={dragValue}
        onChange={(e) => setDragValue(parseInt(e.target.value, 10))}
        onMouseUp={(e) => commit(parseInt(e.currentTarget.value, 10))}
        onTouchEnd={(e) => commit(parseInt(e.currentTarget.value, 10))}
        onKeyUp={(e) => commit(parseInt(e.currentTarget.value, 10))}
        className="water-slider w-full"
        style={{ ["--pct" as string]: `${pct}%` }}
        aria-label="Água consumida hoje"
      />
    </section>
  );
}
