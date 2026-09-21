import { GoalsCard } from "../components/profile/GoalsCard";
import { MyMemoryCard } from "../components/profile/MyMemoryCard";
import { SavedMealsCard } from "../components/profile/SavedMealsCard";
import { ThemeCard } from "../components/profile/ThemeCard";

export function ProfileScreen() {
  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-28">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-ink-900">Perfil</h1>
      </header>

      <div className="space-y-4">
        <ThemeCard />
        <GoalsCard />
        <MyMemoryCard />
        <SavedMealsCard />
      </div>
    </div>
  );
}
