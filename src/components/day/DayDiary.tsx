import type { Goals, LogEntry, MealSlot } from "../../types";
import { MealGroup } from "./MealGroup";

const MEAL_ORDER: MealSlot[] = ["cafe", "almoco", "lanche", "jantar", "outro"];

interface Props {
  entries: LogEntry[];
  goals: Goals;
  onDelete: (id: string) => void;
  onEdit: (entry: LogEntry) => void;
  emptyMessage?: string;
}

export function DayDiary({ entries, goals, onDelete, onEdit, emptyMessage }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-10 text-ink-400 text-sm">
        {emptyMessage ?? "Nenhuma refeição registrada ainda."}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {MEAL_ORDER.map((meal) => (
        <MealGroup
          key={meal}
          meal={meal}
          entries={entries.filter((e) => e.meal === meal)}
          goals={goals}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
