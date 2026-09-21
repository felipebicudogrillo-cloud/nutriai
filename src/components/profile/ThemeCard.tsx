import { useEffect, useState } from "react";
import { applyTheme, getThemePreference, setThemePreference, type ThemePreference } from "../../lib/theme";

const OPTIONS: { value: ThemePreference; label: string; emoji: string }[] = [
  { value: "light", label: "Claro", emoji: "☀️" },
  { value: "dark", label: "Escuro", emoji: "🌙" },
  { value: "system", label: "Sistema", emoji: "📱" },
];

export function ThemeCard() {
  const [pref, setPref] = useState<ThemePreference>(() => getThemePreference());

  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  function choose(value: ThemePreference) {
    setPref(value);
    setThemePreference(value);
  }

  return (
    <div className="bg-surface rounded-xl2 shadow-card p-4">
      <h2 className="font-semibold text-ink-900 mb-3">Aparência</h2>
      <div className="flex gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => choose(o.value)}
            className={`flex-1 rounded-lg py-2.5 text-xs font-medium border flex flex-col items-center gap-1 ${
              pref === o.value ? "border-brand-500 bg-brand-500/10 text-brand-600" : "border-ink-200 text-ink-500"
            }`}
          >
            <span className="text-base">{o.emoji}</span>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
