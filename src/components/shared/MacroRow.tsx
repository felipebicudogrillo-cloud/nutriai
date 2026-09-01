interface Props {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  size?: "sm" | "md";
}

export function MacroRow({ kcal, protein, carbs, fat, size = "sm" }: Props) {
  const text = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className={`flex items-center gap-3 ${text} text-ink-500`}>
      <span className="font-medium text-ink-700">🔥 {Math.round(kcal)} kcal</span>
      <span>💪 {round1(protein)}g</span>
      <span>🍚 {round1(carbs)}g</span>
      <span>🥑 {round1(fat)}g</span>
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
