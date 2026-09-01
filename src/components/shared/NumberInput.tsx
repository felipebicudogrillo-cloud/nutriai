import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  step?: number;
  placeholder?: string;
}

export function NumberInput({ value, onChange, className, step, placeholder }: Props) {
  const [raw, setRaw] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setRaw(String(value));
  }, [value]);

  return (
    <input
      type="number"
      inputMode="decimal"
      className={className}
      placeholder={placeholder}
      step={step}
      value={raw}
      onFocus={() => {
        focused.current = true;
      }}
      onChange={(e) => {
        const v = e.target.value;
        setRaw(v);
        if (v === "" || v === "-" || v === ".") return;
        const n = parseFloat(v);
        if (!Number.isNaN(n)) onChange(n);
      }}
      onBlur={() => {
        focused.current = false;
        setRaw(String(value));
      }}
    />
  );
}
