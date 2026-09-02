import { useEffect, useState } from "react";

function getCurrentScriptSrc(): string | null {
  const el = document.querySelector('script[type="module"][src*="assets/"]');
  return el ? el.getAttribute("src") : null;
}

export function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const currentSrc = getCurrentScriptSrc();
    if (!currentSrc) return;

    async function check() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}index.html`, { cache: "no-store" });
        const html = await res.text();
        const match = html.match(/assets\/index-[^."]+\.js/);
        if (match && currentSrc && !currentSrc.includes(match[0])) {
          setUpdateAvailable(true);
        }
      } catch {
        // network hiccup — just skip this check, try again later
      }
    }

    check();
    const interval = setInterval(check, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!updateAvailable) return null;

  return (
    <button
      onClick={() => window.location.reload()}
      className="fixed top-0 inset-x-0 z-[70] bg-brand-500 text-white text-sm font-medium py-2.5 text-center safe-top active:bg-brand-600"
    >
      Nova versão disponível — toque para atualizar
    </button>
  );
}
