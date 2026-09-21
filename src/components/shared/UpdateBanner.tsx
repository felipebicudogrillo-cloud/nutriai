import { useRegisterSW } from "virtual:pwa-register/react";

export function UpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Check for a new service worker every time the app becomes visible
      // again (e.g. coming back from another app on mobile) — this is the
      // moment a stale mobile tab most needs to notice a new version.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration?.update();
        }
      });
    },
  });

  if (!needRefresh) return null;

  return (
    <button
      onClick={() => updateServiceWorker(true)}
      className="fixed top-0 inset-x-0 z-[70] bg-brand-500 text-white text-sm font-medium py-2.5 text-center safe-top active:bg-brand-600"
    >
      Nova versão disponível — toque para atualizar
    </button>
  );
}
