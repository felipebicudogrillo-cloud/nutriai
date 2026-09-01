export type Tab = "home" | "register" | "history" | "compare" | "profile";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Hoje", icon: "🏠" },
  { id: "history", label: "Histórico", icon: "📅" },
  { id: "register", label: "Registrar", icon: "➕" },
  { id: "compare", label: "Comparar", icon: "📊" },
  { id: "profile", label: "Perfil", icon: "⚙️" },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-t border-ink-100 safe-bottom">
      <div className="mx-auto max-w-md flex items-stretch">
        {ITEMS.map((item) => {
          const isRegister = item.id === "register";
          const isActive = active === item.id;
          if (isRegister) {
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className="flex-1 flex flex-col items-center justify-center py-2"
                aria-label="Registrar"
              >
                <span className="h-11 w-11 -mt-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl shadow-lg shadow-brand-500/30 active:scale-95 transition-transform">
                  +
                </span>
              </button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5"
            >
              <span className={`text-lg ${isActive ? "" : "opacity-50"}`}>{item.icon}</span>
              <span className={`text-[11px] font-medium ${isActive ? "text-brand-600" : "text-ink-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
