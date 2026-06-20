import { useEffect, useState } from "react";
import { X, Phone, Send, Instagram } from "lucide-react";

const SESSION_KEY = "samura_contact_popup_shown";
const MIN_DELAY_MS = 50_000; // ~45-60s
const SCROLL_THRESHOLD = 0.6; // 60%

export function ContactPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      // ignore storage errors
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = window.scrollY / max;
      if (pct >= SCROLL_THRESHOLD) show();
    };

    const timer = window.setTimeout(show, MIN_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="contact-popup-title"
      className="fixed bottom-6 right-6 left-6 z-[60] md:left-auto md:bottom-8 md:right-8 md:w-[420px]"
    >
      <div className="relative border border-border bg-background/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="absolute left-0 top-0 h-full w-px bg-blood" />
        <button
          onClick={() => setOpen(false)}
          aria-label="Закрыть"
          className="absolute right-3 top-3 p-2 text-silver-dim transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-blood" />
          <span className="text-[10px] tracking-[0.4em] text-silver-dim">SAMURA AUTO</span>
        </div>

        <h3
          id="contact-popup-title"
          className="text-xl font-light leading-snug text-foreground md:text-2xl"
        >
          Нужна помощь<br />с <span className="text-blood font-semibold">подбором автомобиля?</span>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-silver-dim">
          Свяжитесь с нами удобным способом и получите бесплатную консультацию
          по подбору и привозу автомобиля.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <PopupLink href="https://t.me/samuraauto" icon={Send} label="Telegram" />
          <PopupLink href="https://www.instagram.com/samura__auto" icon={Instagram} label="Instagram" />
          <PopupLink href="https://vk.ru/club239640500" label="VK" />
          <PopupLink href="tel:+79500901756" icon={Phone} label="Позвонить" primary />
        </div>

        <p className="mt-4 text-[11px] tracking-[0.2em] text-silver-dim">
          +7 950 090 17 56
        </p>
      </div>
    </div>
  );
}

function PopupLink({
  href,
  icon: Icon,
  label,
  primary,
}: {
  href: string;
  icon?: typeof Phone;
  label: string;
  primary?: boolean;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`flex items-center justify-center gap-2 border px-4 py-3 text-xs tracking-[0.2em] transition-all ${
        primary
          ? "border-blood bg-blood text-primary-foreground hover:bg-blood/90"
          : "border-border text-foreground hover:border-blood hover:text-blood"
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />}
      {label.toUpperCase()}
    </a>
  );
}
