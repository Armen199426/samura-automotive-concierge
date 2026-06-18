import { lazy, Suspense, useEffect, useRef, useState } from "react";

const CatalogInner = lazy(() => import("./CatalogInner"));

export function CatalogLazy() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <section id="catalog" ref={ref} className="pt-16 pb-24 lg:py-40">
      {show ? (
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogInner />
        </Suspense>
      ) : (
        <CatalogSkeleton />
      )}
    </section>
  );
}

function CatalogSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <div className="h-10 w-64 bg-graphite/40" />
      <div className="mt-12 h-24 bg-graphite/40" />
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-graphite/40" />
        ))}
      </div>
    </div>
  );
}
