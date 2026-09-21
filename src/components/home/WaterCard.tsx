import { useEffect, useRef, useState } from "react";
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
  const max = Math.ceil(Math.max(goal * 1.5, total, 500) / STEP) * STEP;

  // Local state drives the visual thumb on every drag step (cheap, instant).
  // The global store — and the heavier app-wide re-render it triggers — only
  // gets updated once the user releases, so dragging never feels laggy.
  const [dragValue, setDragValue] = useState(total);
  const draggingRef = useRef(false);
  useEffect(() => {
    if (!draggingRef.current) setDragValue(total);
  }, [total]);

  const trackRef = useRef<HTMLDivElement>(null);
  const pct = Math.min(100, (dragValue / max) * 100);

  function valueFromClientX(clientX: number): number {
    const track = trackRef.current;
    if (!track) return dragValue;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round((ratio * max) / STEP) * STEP;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragValue(valueFromClientX(e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    setDragValue(valueFromClientX(e.clientX));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const value = valueFromClientX(e.clientX);
    setDragValue(value);
    setWaterForDay(date, value);
  }

  return (
    <section className="bg-surface rounded-xl2 shadow-card p-5 mb-4">
      <div className="flex items-end justify-between mb-3">
        <p className="text-xl font-bold text-ink-900 tabular-nums">
          {dragValue}
          <span className="text-sm font-medium text-ink-400"> / {goal} ml água</span>
        </p>
        <span className="text-2xl">💧</span>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Água consumida hoje"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={dragValue}
        className="relative h-8 flex items-center cursor-pointer"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="absolute inset-x-0 h-4 rounded-full bg-ink-100" />
        <div className="absolute left-0 h-4 rounded-full bg-sky-500" style={{ width: `${pct}%` }} />
        <div
          className="absolute h-7 w-7 rounded-full bg-sky-500 border-[3px] border-white shadow-[0_1px_4px_rgba(16,20,24,0.3)]"
          style={{ left: `calc(${pct}% - 14px)` }}
        />
      </div>
    </section>
  );
}
