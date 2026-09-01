import { useMemo, useState } from "react";
import { useApp } from "../state/AppContext";
import { entriesForDay, sumTotals } from "../lib/calc";
import { todayKey } from "../lib/date";
import { ProgressBar } from "../components/shared/ProgressBar";
import { DayDiary } from "../components/day/DayDiary";
import { EditEntryModal } from "../components/day/EditEntryModal";
import type { LogEntry } from "../types";

export function HomeScreen() {
  const { data, deleteEntry } = useApp();
  const [editing, setEditing] = useState<LogEntry | null>(null);
  const date = todayKey();

  const entries = useMemo(() => entriesForDay(data.entries, date), [data.entries, date]);
  const totals = useMemo(() => sumTotals(entries), [entries]);
  const { goals } = data;

  const kcalRemaining = goals.kcal - totals.kcal;
  const kcalOver = kcalRemaining < 0;

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-28">
      <header className="mb-5">
        <p className="text-sm text-ink-400">Hoje</p>
        <h1 className="text-2xl font-bold text-ink-900">{greeting()}</h1>
      </header>

      <section className="bg-white rounded-xl2 shadow-card p-5 mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-3xl font-bold text-ink-900 tabular-nums">
              {Math.round(totals.kcal)}
              <span className="text-base font-medium text-ink-400"> / {goals.kcal} kcal</span>
            </p>
          </div>
          <p className={`text-sm font-medium ${kcalOver ? "text-amber-500" : "text-brand-600"}`}>
            {kcalOver
              ? `🔴 ${Math.abs(Math.round(kcalRemaining))} kcal acima da meta`
              : `🟢 ${Math.round(kcalRemaining)} kcal restantes`}
          </p>
        </div>
        <ProgressBar value={totals.kcal} goal={goals.kcal} />

        <div className="mt-5 mb-2 flex items-end justify-between">
          <p className="text-xl font-bold text-ink-900 tabular-nums">
            {round1(totals.protein)}
            <span className="text-sm font-medium text-ink-400"> / {goals.protein}g proteína</span>
          </p>
        </div>
        <ProgressBar value={totals.protein} goal={goals.protein} color="bg-ink-800" />

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <MacroMini label="Carboidratos" value={totals.carbs} goal={goals.carbs} emoji="🍚" />
          <MacroMini label="Gordura" value={totals.fat} goal={goals.fat} emoji="🥑" />
        </div>
      </section>

      <DayDiary
        entries={entries}
        goals={goals}
        onDelete={deleteEntry}
        onEdit={setEditing}
        emptyMessage="Nenhuma refeição registrada hoje. Toque em + para começar."
      />

      <EditEntryModal entry={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function MacroMini({ label, value, goal, emoji }: { label: string; value: number; goal?: number; emoji: string }) {
  return (
    <div className="bg-ink-50 rounded-lg px-3 py-2">
      <p className="text-ink-400 text-xs">{emoji} {label}</p>
      <p className="font-semibold text-ink-800">
        {round1(value)}g{goal ? <span className="text-ink-400 font-normal text-xs"> / {goal}g</span> : null}
      </p>
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
