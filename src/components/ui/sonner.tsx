import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <Sonner
      theme="dark"
      position={isMobile ? "bottom-center" : "top-right"}
      duration={2800}
      visibleToasts={4}
      gap={10}
      offset={isMobile ? 20 : 24}
      mobileOffset={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group pointer-events-auto relative w-full sm:w-[360px] flex items-start gap-3 rounded-2xl border border-white/10 bg-[rgba(18,18,22,0.72)] backdrop-blur-xl backdrop-saturate-150 px-4 py-3.5 text-sm text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset] data-[swipe=move]:transition-none",
          title: "font-semibold tracking-tight text-[0.92rem] leading-snug",
          description: "text-white/65 text-[0.82rem] leading-snug mt-0.5",
          icon: "shrink-0 mt-0.5",
          success:
            "!border-emerald-400/25 !shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(16,185,129,0.18)_inset,0_0_24px_-6px_rgba(16,185,129,0.35)]",
          error:
            "!border-red-400/25 !shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(239,68,68,0.18)_inset,0_0_24px_-6px_rgba(239,68,68,0.35)]",
          info: "!border-white/10",
          closeButton:
            "!bg-white/5 !border-white/10 !text-white/70 hover:!bg-white/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
