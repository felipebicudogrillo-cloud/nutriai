import { useState } from "react";
import { AppProvider } from "./state/AppContext";
import { BottomNav, type Tab } from "./components/layout/BottomNav";
import { HomeScreen } from "./screens/HomeScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { UpdateBanner } from "./components/shared/UpdateBanner";

function AppShell() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-ink-50 safe-top">
      <UpdateBanner />
      {tab === "home" && <HomeScreen />}
      {tab === "register" && <RegisterScreen onDone={() => setTab("home")} />}
      {tab === "history" && <HistoryScreen />}
      {tab === "compare" && <CompareScreen />}
      {tab === "profile" && <ProfileScreen />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
