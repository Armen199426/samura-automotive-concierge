import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CARS as ALL_CARS } from "@/data/cars";

const COUNTRIES = ["Все", "Япония", "Китай", "Корея"] as const;
type Country = (typeof COUNTRIES)[number];

function SectionHead({ eyebrow, title, className = "" }: { eyebrow: string; title: React.ReactNode; className?: string }) {
  return (
    <div className={`reveal ${className}`}>
      <div className="mb-6 flex items-center gap-4">
        <span className="h-px w-10 bg-blood" />
        <span className="text-[11px] tracking-[0.5em] text-silver-dim">{eyebrow}</span>
      </div>
      <h2 className="text-4xl font-light leading-[1.05] md:text-5xl lg:text-[64px]">{title}</h2>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.3em] text-silver-dim mb-2">{label.toUpperCase()}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border-0 border-b border-border bg-transparent py-2 text-foreground outline-none focus:border-blood cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background text-foreground">{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function CatalogInner() {
  const [country, setCountry] = useState<Country>("Все");
  const [brand, setBrand] = useState<string>("Все");
  const [fuel, setFuel] = useState<string>("Все");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [visible, setVisible] = useState(12);

  const brands = ["Все", ...Array.from(new Set(ALL_CARS.map((c) => c.brand))).sort()];
  const fuels = ["Все", ...Array.from(new Set(ALL_CARS.map((c) => c.fuel).filter(Boolean)))];

  const filtered = ALL_CARS.filter((c) => {
    if (country !== "Все" && c.country !== country) return false;
    if (brand !== "Все" && c.brand !== brand) return false;
    if (fuel !== "Все" && c.fuel !== fuel) return false;
    if (yearFrom && c.year < parseInt(yearFrom)) return false;
    return true;
  });

  const shown = filtered.slice(0, visible);

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead
          eyebrow="КАТАЛОГ"
          title={<>Автомобили <span className="text-blood font-semibold">на доставку</span></>}
          className="lg:max-w-2xl"
        />
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((f) => (
            <button
              key={f}
              onClick={() => { setCountry(f); setVisible(12); }}
              className={`border px-5 py-2.5 text-[11px] tracking-[0.25em] transition-all ${
                country === f
                  ? "border-blood bg-blood text-primary-foreground"
                  : "border-border text-silver-dim hover:border-silver/40 hover:text-foreground"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-4 border border-border bg-graphite/40 p-6 md:grid-cols-4">
        <SelectField label="Марка" value={brand} onChange={(v) => { setBrand(v); setVisible(12); }} options={brands} />
        <SelectField label="Топливо" value={fuel} onChange={(v) => { setFuel(v); setVisible(12); }} options={fuels} />
        <label className="block">
          <span className="block text-[10px] tracking-[0.3em] text-silver-dim mb-2">ГОД ОТ</span>
          <input
            type="number"
            placeholder="2018"
            value={yearFrom}
            onChange={(e) => { setYearFrom(e.target.value); setVisible(12); }}
            className="w-full border-0 border-b border-border bg-transparent py-2 text-foreground placeholder:text-silver-dim/60 outline-none focus:border-blood"
          />
        </label>
        <div className="flex items-end justify-between gap-3">
          <div className="text-[10px] tracking-[0.3em] text-silver-dim">
            НАЙДЕНО<br /><span className="text-2xl font-light text-metal">{filtered.length}</span>
          </div>
          <button
            onClick={() => { setBrand("Все"); setFuel("Все"); setYearFrom(""); setVisible(12); }}
            className="border border-border px-4 py-2 text-[10px] tracking-[0.25em] text-silver-dim transition-colors hover:border-blood hover:text-blood"
          >
            СБРОСИТЬ
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((c, i) => (
          <article key={i} className="group relative overflow-hidden border border-border bg-graphite/40 transition-all duration-500 hover:border-blood/60 hover:shadow-red">
            <div className="relative aspect-[4/3] overflow-hidden bg-background">
              <img
                src={c.img}
                alt={`${c.brand} ${c.model}`}
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              <span className="absolute left-4 top-4 border border-silver/20 bg-background/70 px-3 py-1 text-[10px] tracking-[0.3em] text-silver backdrop-blur">
                {c.country.toUpperCase()}
              </span>
              <span className="absolute right-4 top-4 border border-blood/40 bg-background/70 px-3 py-1 text-[10px] tracking-[0.3em] text-blood backdrop-blur">
                {c.year}
              </span>
            </div>
            <div className="p-6 pb-5">
              <div className="text-[10px] tracking-[0.3em] text-silver-dim">{c.brand}</div>
              <h3 className="mt-1 text-lg font-medium text-foreground line-clamp-1">{c.model}</h3>
              <div className="mt-3 grid grid-cols-2 gap-y-1.5 border-t border-border pt-3 text-[11px] text-silver-dim">
                {c.mileage && c.mileage !== "—" && <span>Пробег: <span className="text-silver">{c.mileage}</span></span>}
                {c.transmission && <span>КПП: <span className="text-silver">{c.transmission}</span></span>}
                {c.displacement && <span>Объём: <span className="text-silver">{c.displacement}</span></span>}
                {c.fuel && <span>Топливо: <span className="text-silver">{c.fuel}</span></span>}
                {c.drivetrain && <span>Привод: <span className="text-silver">{c.drivetrain}</span></span>}
                {c.body && <span>Кузов: <span className="text-silver">{c.body}</span></span>}
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[9px] tracking-[0.3em] text-silver-dim">ОТ</div>
                  <div className="text-lg font-light text-metal leading-tight">{c.price} ₽</div>
                </div>
                <a
                  href="#hero-form"
                  className="inline-flex items-center gap-1.5 border border-blood/60 bg-blood/10 px-3 py-2 text-[10px] font-medium tracking-[0.2em] text-blood transition-all hover:bg-blood hover:text-primary-foreground"
                >
                  РАССЧИТАТЬ
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + 12)}
            className="border border-border px-8 py-4 text-[11px] tracking-[0.3em] text-foreground transition-all hover:border-blood hover:text-blood"
          >
            ПОКАЗАТЬ ЕЩЁ <span className="ml-2 text-silver-dim">({filtered.length - visible})</span>
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="mt-12 border border-border bg-graphite/30 p-16 text-center">
          <p className="text-silver-dim">По выбранным фильтрам ничего не найдено.</p>
        </div>
      )}
    </div>
  );
}
