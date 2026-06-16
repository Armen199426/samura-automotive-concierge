import { useEffect, useState } from "react";

const KEY = "samura_cookie_consent_v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, "accepted"); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <p className="text-sm leading-relaxed text-silver-dim">
          Мы используем файлы cookie для корректной работы сайта и улучшения пользовательского опыта.
          Продолжая использовать сайт, вы соглашаетесь с{" "}
          <a href="/privacy" className="text-blood underline-offset-4 hover:underline">
            политикой конфиденциальности
          </a>
          {" "}и обработкой файлов cookie.
        </p>
        <button
          onClick={accept}
          className="inline-flex shrink-0 items-center justify-center border border-blood bg-blood px-6 py-2.5 text-xs tracking-[0.2em] text-foreground transition-all hover:bg-blood/90"
        >
          ПРИНЯТЬ
        </button>
      </div>
    </div>
  );
}
