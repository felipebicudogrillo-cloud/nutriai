interface Props {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  size?: "sm" | "md";
}

export function MacroRow({ kcal, protein, carbs, fat, sugar, size = "sm" }: Props) {
  const text = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 ${text} text-ink-500`}>
      <span className="font-medium text-ink-700">🔥 {Math.round(kcal)} kcal</span>
      <span>💪 {round1(protein)}g</span>
      <span>🍚 {round1(carbs)}g</span>
      <span>🥑 {round1(fat)}g</span>
      <span>🍬 {round1(sugar)}g</span>
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
