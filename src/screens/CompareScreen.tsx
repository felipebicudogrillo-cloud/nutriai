import { useMemo, useState } from "react";
import { useApp } from "../state/AppContext";
import { entriesForDay, sumTotals, withinGoal } from "../lib/calc";
import { formatDayShort, lastNDays, todayKey } from "../lib/date";

type Period = 7 | 14 | 30;

export function CompareScreen() {
  const [mode, setMode] = useState<"days" | "period">("period");
  const [period, setPeriod] = useState<Period>(7);
  const [dateA, setDateA] = useState(todayKey());
  const [dateB, setDateB] = useState(lastNDays(2)[0]);

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-28">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-ink-900">Comparar</h1>
      </header>

      <div className="flex gap-2 mb-5">
        <ModeButton active={mode === "period"} onClick={() => setMode("period")} label="Período" />
        <ModeButton active={mode === "days"} onClick={() => setMode("days")} label="Dois dias" />
      </div>

      {mode === "period" ? (
        <PeriodView period={period} onChangePeriod={setPeriod} />
      ) : (
        <DaysView dateA={dateA} dateB={dateB} onChangeA={setDateA} onChangeB={setDateB} />
      )}

      <ConsistencySection />
    </div>
  );

  function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
      <button
        onClick={onClick}
        className={`flex-1 rounded-lg py-2 text-sm font-medium border ${
          active ? "border-brand-500 bg-brand-500/10 text-brand-600" : "border-ink-200 text-ink-500"
        }`}
      >
        {label}
      </button>
    );
  }
}

function DaysView({
  dateA,
  dateB,
  onChangeA,
  onChangeB,
}: {
  dateA: string;
  dateB: string;
  onChangeA: (d: string) => void;
  onChangeB: (d: string) => void;
}) {
  const { data } = useApp();
  const totalsA = sumTotals(entriesForDay(data.entries, dateA));
  const totalsB = sumTotals(entriesForDay(data.entries, dateB));

  const rows: [string, number, number, number | undefined][] = [
    ["Calorias (kcal)", totalsA.kcal, totalsB.kcal, data.goals.kcal],
    ["Proteína (g)", totalsA.protein, totalsB.protein, data.goals.protein],
    ["Carboidratos (g)", totalsA.carbs, totalsB.carbs, data.goals.carbs],
    ["Gordura (g)", totalsA.fat, totalsB.fat, data.goals.fat],
  ];

  return (
    <div className="bg-white rounded-xl2 shadow-card p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="date"
          value={dateA}
          max={todayKey()}
          onChange={(e) => onChangeA(e.target.value)}
          className="flex-1 rounded-lg border border-ink-200 px-2 py-1.5 text-sm"
        />
        <span className="text-ink-300 text-sm">vs</span>
        <input
          type="date"
          value={dateB}
          max={todayKey()}
          onChange={(e) => onChangeB(e.target.value)}
          className="flex-1 rounded-lg border border-ink-200 px-2 py-1.5 text-sm"
        />
      </div>

      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, a, b, goal]) => {
            const better = a === b ? null : compareBetter(label, a, b);
            return (
              <tr key={label} className="border-t border-ink-100 first:border-0">
                <td className="py-2 text-ink-500">{label}</td>
                <td className={`py-2 text-right tabular-nums font-medium ${better === "a" ? "text-brand-600" : "text-ink-900"}`}>
                  {round1(a)}
                </td>
                <td className={`py-2 text-right tabular-nums font-medium ${better === "b" ? "text-brand-600" : "text-ink-900"}`}>
                  {round1(b)}
                </td>
                {goal !== undefined && <td className="py-2 pl-3 text-right text-ink-300 text-xs">meta {goal}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function compareBetter(label: string, a: number, b: number): "a" | "b" {
  if (label.startsWith("Proteína")) return a > b ? "a" : "b";
  return a < b ? "a" : "b";
}

function PeriodView({ period, onChangePeriod }: { period: Period; onChangePeriod: (p: Period) => void }) {
  const { data } = useApp();
  const days = useMemo(() => lastNDays(period), [period]);
  const perDay = useMemo(
    () => days.map((d) => ({ date: d, totals: sumTotals(entriesForDay(data.entries, d)) })),
    [days, data.entries]
  );
  const avg = useMemo(() => {
    const t = sumTotals(perDay.map((p) => p.totals));
    return {
      kcal: t.kcal / period,
      protein: t.protein / period,
      carbs: t.carbs / period,
      fat: t.fat / period,
    };
  }, [perDay, period]);

  const maxKcal = Math.max(data.goals.kcal, ...perDay.map((p) => p.totals.kcal), 1);

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        {[7, 14, 30].map((p) => (
          <button
            key={p}
            onClick={() => onChangePeriod(p as Period)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium border ${
              period === p ? "border-ink-800 bg-ink-900 text-white" : "border-ink-200 text-ink-500"
            }`}
          >
            {p} dias
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl2 shadow-card p-4 mb-3">
        <p className="text-xs text-ink-400 mb-3">Média diária · últimos {period} dias</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <AvgTile label="Calorias" value={Math.round(avg.kcal)} unit="kcal/dia" goal={data.goals.kcal} emoji="🔥" />
          <AvgTile label="Proteína" value={round1(avg.protein)} unit="g/dia" goal={data.goals.protein} emoji="💪" />
          <AvgTile label="Carboidratos" value={round1(avg.carbs)} unit="g/dia" goal={data.goals.carbs} emoji="🍚" />
          <AvgTile label="Gordura" value={round1(avg.fat)} unit="g/dia" goal={data.goals.fat} emoji="🥑" />
        </div>
      </div>

      <div className="bg-white rounded-xl2 shadow-card p-4">
        <p className="text-xs text-ink-400 mb-3">Calorias por dia vs meta</p>
        <div className="flex items-end gap-1 h-28">
          {perDay.map(({ date, totals }) => {
            const h = Math.max(4, (totals.kcal / maxKcal) * 100);
            const ok = withinGoal(totals.kcal, data.goals.kcal);
            return (
              <div key={date} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className={`w-full rounded-t-sm ${totals.kcal === 0 ? "bg-ink-100" : ok ? "bg-brand-400" : "bg-amber-400"}`}
                  style={{ height: `${h}%` }}
                  title={`${formatDayShort(date)}: ${Math.round(totals.kcal)} kcal`}
                />
              </div>
            );
          })}
        </div>
        {period <= 14 && (
          <div className="flex gap-1 mt-1">
            {perDay.map(({ date }) => (
              <span key={date} className="flex-1 text-center text-[9px] text-ink-300">
                {formatDayShort(date).slice(0, 2)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AvgTile({ label, value, unit, goal, emoji }: { label: string; value: number; unit: string; goal?: number; emoji: string }) {
  return (
    <div className="bg-ink-50 rounded-lg px-3 py-2">
      <p className="text-ink-400 text-xs">{emoji} {label}</p>
      <p className="font-semibold text-ink-800">
        {value} <span className="text-ink-400 font-normal text-xs">{unit}</span>
      </p>
      {goal !== undefined && <p className="text-[11px] text-ink-300">meta {goal}</p>}
    </div>
  );
}

function ConsistencySection() {
  const { data } = useApp();

  function score(n: number) {
    const days = lastNDays(n).filter((d) => entriesForDay(data.entries, d).length > 0);
    const kcalOk = days.filter((d) => withinGoal(sumTotals(entriesForDay(data.entries, d)).kcal, data.goals.kcal)).length;
    const proteinOk = days.filter(
      (d) => sumTotals(entriesForDay(data.entries, d)).protein >= data.goals.protein * 0.9
    ).length;
    return { total: days.length, kcalOk, proteinOk };
  }

  const w = score(7);
  const m = score(30);

  return (
    <div className="bg-white rounded-xl2 shadow-card p-4">
      <h2 className="font-semibold text-ink-900 mb-3">Consistência</h2>
      <div className="space-y-3 text-sm">
        <ConsistencyRow label="Últimos 7 dias" data={w} />
        <ConsistencyRow label="Últimos 30 dias" data={m} />
      </div>
    </div>
  );
}

function ConsistencyRow({ label, data }: { label: string; data: { total: number; kcalOk: number; proteinOk: number } }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-400 mb-1">{label}</p>
      <p className="text-ink-700">
        <strong className="text-ink-900">{data.kcalOk}/{data.total || 0}</strong> dias dentro da meta de calorias
      </p>
      <p className="text-ink-700">
        <strong className="text-ink-900">{data.proteinOk}/{data.total || 0}</strong> dias atingindo a meta de proteína
      </p>
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
