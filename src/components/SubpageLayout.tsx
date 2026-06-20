import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.webp";
import { useReveal } from "@/hooks/use-reveal";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface SubpageLayoutProps {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  breadcrumbs: Breadcrumb[];
  children: React.ReactNode;
}

export function SubpageLayout({ eyebrow, title, lead, breadcrumbs, children }: SubpageLayoutProps) {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="SAMURA AUTO" className="h-11 w-11 object-contain" width={44} height={44} />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.28em] text-metal">SAMURA</div>
              <div className="text-[10px] tracking-[0.42em] text-blood">AUTO</div>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-blood bg-blood px-5 py-2.5 text-xs tracking-[0.2em] text-foreground transition-all hover:bg-blood/90"
          >
            НА ГЛАВНУЮ <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
            <nav aria-label="breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.3em] text-silver-dim">
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  {b.href ? (
                    <Link to={b.href} className="hover:text-blood">{b.label.toUpperCase()}</Link>
                  ) : (
                    <span className="text-foreground">{b.label.toUpperCase()}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-silver-dim/60" />}
                </span>
              ))}
            </nav>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-blood" />
              <span className="text-[11px] tracking-[0.5em] text-silver-dim">{eyebrow}</span>
            </div>
            <h1 className="text-4xl font-light leading-[1.05] tracking-tight md:text-5xl lg:text-[64px]">{title}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-silver-dim">{lead}</p>
          </div>
        </section>

        <div className="mx-auto max-w-[1100px] px-6 py-20 lg:px-10 lg:py-28">
          {children}
        </div>

        <section className="border-t border-border bg-graphite/40 py-20 lg:py-28">
          <div className="mx-auto max-w-[1100px] px-6 text-center lg:px-10">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-blood" />
              <span className="text-[11px] tracking-[0.5em] text-silver-dim">ЗАЯВКА</span>
              <span className="h-px w-10 bg-blood" />
            </div>
            <h2 className="text-3xl font-light md:text-4xl lg:text-5xl">
              Готовы <span className="text-blood font-semibold">подобрать автомобиль?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-silver-dim">
              Оставьте заявку — рассчитаем стоимость, сроки и выгоду относительно рынка РФ.
            </p>
            <Link
              to="/"
              hash="hero-form"
              className="mt-10 inline-flex items-center gap-3 bg-blood px-8 py-4 text-sm font-medium tracking-[0.25em] text-primary-foreground shadow-red transition-all hover:bg-blood/90"
            >
              ОСТАВИТЬ ЗАЯВКУ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 text-xs text-silver-dim md:flex-row md:items-center lg:px-10">
          <div>© {new Date().getFullYear()} SAMURA AUTO. Все права защищены.</div>
          <Link to="/" className="tracking-[0.3em] hover:text-blood">НА ГЛАВНУЮ</Link>
        </div>
      </footer>
    </div>
  );
}

export function ContentSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="reveal mb-16">
      <h2 className="mb-6 text-2xl font-light text-foreground md:text-3xl">
        <span className="mr-3 inline-block h-px w-8 align-middle bg-blood" />
        {heading}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-silver-dim md:text-lg">{children}</div>
    </section>
  );
}

export function FeatureGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="reveal mb-16 grid gap-px bg-border md:grid-cols-2">
      {items.map((it, i) => (
        <div key={i} className="bg-background p-8">
          <div className="text-[10px] tracking-[0.4em] text-silver-dim">0{i + 1}</div>
          <h3 className="mt-4 text-lg font-medium text-foreground">{it.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-silver-dim">{it.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="reveal mb-16 grid gap-px bg-border md:grid-cols-2">
      {items.map((it, i) => (
        <li key={i} className="bg-background p-8">
          <div className="text-[10px] tracking-[0.4em] text-blood">ЭТАП {String(i + 1).padStart(2, "0")}</div>
          <h3 className="mt-4 text-lg font-medium text-foreground">{it.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-silver-dim">{it.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="reveal mb-16 divide-y divide-border border-y border-border">
      {items.map((it, i) => (
        <details key={i} className="group py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium text-foreground md:text-lg">
            <span>{it.q}</span>
            <span className="mt-1 shrink-0 text-blood transition-transform group-open:rotate-45 text-xl leading-none">+</span>
          </summary>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-silver-dim md:text-base">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function buildFaqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
