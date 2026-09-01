import { useEffect, useState } from "react";
import type { Food, FoodBasis, Unit } from "../../types";
import { Modal } from "../shared/Modal";
import { NumberInput } from "../shared/NumberInput";
import { useApp } from "../../state/AppContext";

interface Props {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  editingFood?: Food | null;
  onSaved?: (food: Food) => void;
}

const emptyForm = (name = "") => ({
  name,
  brand: "",
  basis: "perUnit" as FoodBasis,
  volumeUnit: "g" as Extract<Unit, "g" | "ml">,
  refAmount: 100,
  kcal: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  aliases: "",
  emoji: "🍽️",
});

export function FoodEditor({ open, onClose, initialName, editingFood, onSaved }: Props) {
  const { addCustomFood, updateCustomFood } = useApp();
  const [form, setForm] = useState(emptyForm(initialName));

  useEffect(() => {
    if (editingFood) {
      setForm({
        name: editingFood.name,
        brand: editingFood.brand ?? "",
        basis: editingFood.basis,
        volumeUnit: editingFood.unit === "ml" ? "ml" : "g",
        refAmount: editingFood.refAmount,
        kcal: editingFood.kcal,
        protein: editingFood.protein,
        carbs: editingFood.carbs,
        fat: editingFood.fat,
        aliases: editingFood.aliases.join(", "),
        emoji: editingFood.emoji ?? "🍽️",
      });
    } else {
      setForm(emptyForm(initialName));
    }
  }, [editingFood, initialName, open]);

  if (!open) return null;

  function save() {
    if (!form.name.trim()) return;
    const aliases = form.aliases
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    const unit: Unit = form.basis === "perUnit" ? "unidade" : form.volumeUnit;
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      aliases,
      unit,
      basis: form.basis,
      refAmount: form.basis === "per100" ? 100 : form.refAmount || 1,
      kcal: form.kcal,
      protein: form.protein,
      carbs: form.carbs,
      fat: form.fat,
      emoji: form.emoji || "🍽️",
    };
    if (editingFood) {
      updateCustomFood(editingFood.id, payload);
      onSaved?.({ ...editingFood, ...payload });
    } else {
      const created = addCustomFood(payload);
      onSaved?.(created);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editingFood ? "Editar alimento" : "Criar alimento"}>
      <div className="space-y-4">
        <Field label="Nome">
          <input
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            placeholder="Ex: Pudim do Mercadona"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Field label="Marca (opcional)">
            <input
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              placeholder="Ex: Mercadona"
              value={form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            />
          </Field>
          <Field label="Emoji">
            <input
              className="w-14 rounded-lg border border-ink-200 px-3 py-2 text-sm text-center"
              value={form.emoji}
              onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
            />
          </Field>
        </div>

        <Field label="Tipo de porção">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, basis: "perUnit" }))}
              className={pillClass(form.basis === "perUnit")}
            >
              Por unidade
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, basis: "per100" }))}
              className={pillClass(form.basis === "per100")}
            >
              Por 100g/100ml
            </button>
          </div>
        </Field>

        {form.basis === "perUnit" ? (
          <Field label="Quanto pesa 1 unidade (g, opcional)">
            <NumberInput
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
              value={form.refAmount}
              onChange={(v) => setForm((f) => ({ ...f, refAmount: v }))}
            />
          </Field>
        ) : (
          <Field label="Unidade de medida">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, volumeUnit: "g" }))}
                className={pillClass(form.volumeUnit === "g")}
              >
                Gramas (g)
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, volumeUnit: "ml" }))}
                className={pillClass(form.volumeUnit === "ml")}
              >
                Mililitros (ml)
              </button>
            </div>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <NumField
            label={`Calorias ${form.basis === "perUnit" ? "(por unidade)" : "(por 100g)"}`}
            value={form.kcal}
            onChange={(v) => setForm((f) => ({ ...f, kcal: v }))}
          />
          <NumField label="Proteína (g)" value={form.protein} onChange={(v) => setForm((f) => ({ ...f, protein: v }))} />
          <NumField label="Carboidratos (g)" value={form.carbs} onChange={(v) => setForm((f) => ({ ...f, carbs: v }))} />
          <NumField label="Gordura (g)" value={form.fat} onChange={(v) => setForm((f) => ({ ...f, fat: v }))} />
        </div>

        <Field label="Apelidos (separados por vírgula)">
          <input
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            placeholder="Ex: meu pudim, pudim mercadona"
            value={form.aliases}
            onChange={(e) => setForm((f) => ({ ...f, aliases: e.target.value }))}
          />
        </Field>

        <button
          onClick={save}
          disabled={!form.name.trim()}
          className="w-full rounded-xl bg-brand-500 disabled:opacity-40 text-white font-medium py-2.5 text-sm active:scale-[0.98] transition-transform"
        >
          Salvar
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-500 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      <NumberInput className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm" value={value} onChange={onChange} />
    </Field>
  );
}

function pillClass(active: boolean) {
  return `flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
    active ? "border-brand-500 bg-brand-500/10 text-brand-600" : "border-ink-200 text-ink-500"
  }`;
}
