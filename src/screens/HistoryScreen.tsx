import { useMemo, useState } from "react";
import { useApp } from "../state/AppContext";
import { entriesForDay, round1, sumTotals, withinGoal } from "../lib/calc";
import { formatDayLabel, formatWeekday, isToday, isYesterday } from "../lib/date";
import { Modal } from "../components/shared/Modal";
import { DayDiary } from "../components/day/DayDiary";
import { EditEntryModal } from "../components/day/EditEntryModal";
import type { LogEntry } from "../types";

export function HistoryScreen() {
  const { data, deleteEntry } = useApp();
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [editing, setEditing] = useState<LogEntry | null>(null);

  const dates = useMemo(() => {
    const set = new Set(data.entries.map((e) => e.date));
    return [...set].sort((a, b) => (a < b ? 1 : -1));
  }, [data.entries]);

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-28">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-ink-900">Histórico</h1>
      </header>

      {dates.length === 0 && (
        <p className="text-center text-ink-400 text-sm py-16">Seus dias registrados vão aparecer aqui.</p>
      )}

      <div className="space-y-2">
        {dates.map((date) => {
          const entries = entriesForDay(data.entries, date);
          const totals = sumTotals(entries);
          const ok = withinGoal(totals.kcal, data.goals.kcal);
          const diff = Math.round(totals.kcal - data.goals.kcal);
          return (
            <button
              key={date}
              onClick={() => setOpenDate(date)}
              className="w-full bg-white rounded-xl2 shadow-card p-4 flex items-center justify-between text-left"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400">
                  {isToday(date) ? "Hoje" : isYesterday(date) ? "Ontem" : `${formatWeekday(date)} · ${formatDayLabel(date)}`}
                </p>
                <p className="font-semibold text-ink-900 mt-0.5">
                  {Math.round(totals.kcal)} kcal <span className="text-ink-400 font-normal">· {round1(totals.protein)}g proteína</span>
                </p>
              </div>
              <span className={`text-xs font-medium ${ok ? "text-brand-600" : "text-amber-500"}`}>
                {ok ? "🟢 Dentro da meta" : `🔴 ${diff} acima`}
              </span>
            </button>
          );
        })}
      </div>

      <Modal open={!!openDate} onClose={() => setOpenDate(null)} title={openDate ? formatDayLabel(openDate) : ""}>
        {openDate && (
          <DayDiary
            entries={entriesForDay(data.entries, openDate)}
            goals={data.goals}
            onDelete={deleteEntry}
            onEdit={setEditing}
          />
        )}
      </Modal>

      <EditEntryModal entry={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
