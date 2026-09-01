export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return todayKey(dt);
}

export function lastNDays(n: number, endKey: string = todayKey()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(endKey, -i));
  return out;
}

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export function formatDayLabel(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1].toUpperCase()}`;
}

export function formatDayShort(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
}

export function formatWeekday(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return WEEKDAYS[dt.getDay()];
}

export function isToday(key: string): boolean {
  return key === todayKey();
}

export function isYesterday(key: string): boolean {
  return key === addDays(todayKey(), -1);
}

export function inferMealFromTime(d: Date = new Date()): "cafe" | "almoco" | "lanche" | "jantar" | "outro" {
  const h = d.getHours();
  if (h >= 5 && h < 10) return "cafe";
  if (h >= 10 && h < 15) return "almoco";
  if (h >= 15 && h < 18) return "lanche";
  if (h >= 18 && h < 23) return "jantar";
  return "outro";
}
