import { useState } from "react";
import { useApp } from "../../state/AppContext";
import { NumberInput } from "../shared/NumberInput";

export function GoalsCard() {
  const { data, setGoals } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(data.goals);

  function save() {
    setGoals(form);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="bg-white rounded-xl2 shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-ink-900">Metas diárias</h2>
          <button
            onClick={() => {
              setForm(data.goals);
              setEditing(true);
            }}
            className="text-xs font-medium text-brand-600"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Tile label="Calorias" value={`${data.goals.kcal} kcal`} />
          <Tile label="Proteína" value={`${data.goals.protein} g`} />
          <Tile label="Carboidratos" value={data.goals.carbs ? `${data.goals.carbs} g` : "—"} />
          <Tile label="Gordura" value={data.goals.fat ? `${data.goals.fat} g` : "—"} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl2 shadow-card p-4">
      <h2 className="font-semibold text-ink-900 mb-3">Editar metas</h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <NumField label="Calorias (kcal)" value={form.kcal} onChange={(v) => setForm((f) => ({ ...f, kcal: v }))} />
        <NumField label="Proteína (g)" value={form.protein} onChange={(v) => setForm((f) => ({ ...f, protein: v }))} />
        <NumField label="Carboidratos (g)" value={form.carbs ?? 0} onChange={(v) => setForm((f) => ({ ...f, carbs: v }))} />
        <NumField label="Gordura (g)" value={form.fat ?? 0} onChange={(v) => setForm((f) => ({ ...f, fat: v }))} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setEditing(false)} className="flex-1 rounded-lg border border-ink-200 text-ink-500 text-sm font-medium py-2">
          Cancelar
        </button>
        <button onClick={save} className="flex-1 rounded-lg bg-brand-500 text-white text-sm font-medium py-2">
          Salvar
        </button>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-50 rounded-lg px-3 py-2">
      <p className="text-ink-400 text-xs">{label}</p>
      <p className="font-semibold text-ink-800">{value}</p>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-500 mb-1 block">{label}</label>
      <NumberInput className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm" value={value} onChange={onChange} />
    </div>
  );
}
