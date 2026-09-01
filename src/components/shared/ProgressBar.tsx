interface Props {
  value: number;
  goal: number;
  color?: string;
}

export function ProgressBar({ value, goal, color = "bg-brand-500" }: Props) {
  const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  const over = goal > 0 && value > goal;
  return (
    <div className="h-2.5 w-full rounded-full bg-ink-100 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${over ? "bg-amber-500" : color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
