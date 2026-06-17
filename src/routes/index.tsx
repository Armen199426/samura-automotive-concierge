import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck, Search, Banknote, Truck, FileLock2, Camera,
  ArrowRight, Phone, MessageCircle, MapPin, Menu, X, Plus, Minus,
  AlertTriangle, Gauge, FileWarning, History, CreditCard, AlertOctagon,
  ChevronLeft, ChevronRight, Send,
} from "lucide-react";
import logo from "@/assets/logo.png";
import heroCar from "@/assets/hero-car.jpg";
import ctaCar from "@/assets/cta-car.jpg";
import { CARS as ALL_CARS } from "@/data/cars";
import { useReveal } from "@/hooks/use-reveal";
import { CookieBanner } from "@/components/CookieBanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAMURA AUTO — Автомобили из Азии, Европы и США под заказ" },
      { name: "description", content: "Подбор, проверка, выкуп и доставка автомобилей под ключ. Прозрачная сделка на каждом этапе." },
      { property: "og:title", content: "SAMURA AUTO — Импорт автомобилей под заказ" },
      { property: "og:description", content: "Импорт · Уверенность · Под ключ" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SAMURA AUTO — Импорт автомобилей под заказ" },
      { name: "twitter:description", content: "Импорт · Уверенность · Под ключ" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Каталог", href: "#catalog" },
  { label: "Процесс", href: "#process" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <img src={logo} alt="SAMURA AUTO" className="h-11 w-11 object-contain" width={44} height={44} />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[0.28em] text-metal">SAMURA</div>
            <div className="text-[10px] tracking-[0.42em] text-blood">AUTO</div>
          </div>
        </a>
        <nav className="hidden items-center gap-10 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}
              className="group relative text-sm tracking-wide text-silver-dim transition-colors hover:text-foreground">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-blood transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href="#hero-form" className="hidden lg:inline-flex items-center gap-2 border border-blood bg-blood px-5 py-2.5 text-xs tracking-[0.2em] text-foreground shadow-[0_0_24px_-6px_var(--color-blood)] transition-all hover:bg-blood/90 hover:shadow-[0_0_36px_-4px_var(--color-blood)]">
          СВЯЗАТЬСЯ <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-6">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                className="border-b border-border/40 py-4 text-sm tracking-wide text-silver-dim hover:text-foreground">
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-grain">
      <div className="absolute inset-0">
        <img src={heroCar} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pt-32 pb-20 lg:px-10">
        <div className="max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 bg-blood" />
            <span className="text-[11px] tracking-[0.5em] text-silver-dim">EST. 2019</span>
          </div>
          <h1 className="text-5xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-[88px]">
            Автомобили из <span className="text-metal font-semibold">Китая, Японии, Южной Кореи, Европы</span><br />
            и США <span className="text-blood font-semibold">под заказ</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-silver-dim">
            Подбираем, проверяем, выкупаем и доставляем ваш автомобиль под ключ —
            с полной прозрачностью на каждом этапе.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#hero-form" className="group inline-flex items-center gap-3 bg-blood px-8 py-4 text-sm font-medium tracking-[0.2em] text-primary-foreground shadow-red transition-all hover:bg-blood/90">
              ПОДОБРАТЬ АВТО
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#catalog" className="inline-flex items-center gap-3 border border-border bg-background/40 px-8 py-4 text-sm tracking-[0.2em] text-foreground backdrop-blur transition-all hover:border-silver/40">
              ОТКРЫТЬ КАТАЛОГ
            </a>
          </div>
          <div className="mt-16 flex items-center gap-6">
            <div className="text-[10px] tracking-[0.4em] text-silver-dim">НАЙДЁМ</div>
            <div className="h-px w-8 bg-border" />
            <div className="text-[10px] tracking-[0.4em] text-silver">ПРОВЕРИМ</div>
            <div className="h-px w-8 bg-border" />
            <div className="text-[10px] tracking-[0.4em] text-blood">ПРИВЕЗЁМ</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blood/40 to-transparent" />
    </section>
  );
}

function HeroForm() {
  return (
    <section id="hero-form" className="relative border-y border-border bg-graphite/40 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:px-10">
        <div className="reveal">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-blood" />
            <span className="text-[11px] tracking-[0.5em] text-silver-dim">ЗАЯВКА</span>
          </div>
          <h2 className="text-4xl font-light leading-tight md:text-5xl lg:text-[56px]">
            Какой автомобиль<br />хотите <span className="text-blood font-semibold">привезти?</span>
          </h2>
          <p className="mt-6 max-w-md text-silver-dim">
            Эксперт SAMURA AUTO рассчитает стоимость, сроки доставки и реальную выгоду
            по сравнению с рынком РФ.
          </p>
          <div className="mt-12 glass-card p-8">
            <div className="flex items-start gap-4">
              <div className="red-bar h-12" />
              <div>
                <div className="text-xs tracking-[0.3em] text-silver-dim">ПЕРСОНАЛЬНЫЙ ЭКСПЕРТ</div>
                <p className="mt-3 text-lg leading-relaxed text-foreground">
                  «Мы подберём автомобиль индивидуально и исключительно под ваши требования,
                  с полной проверкой, честным расчётом и отчётами на каждом шагу».
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); alert("Заявка отправлена. Мы свяжемся с вами."); }}
          className="reveal glass-card p-8 lg:p-12"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Марка авто" placeholder="Toyota, BMW, Lexus..." />
            <Field label="Бюджет" placeholder="до 5 000 000 ₽" />
            <Field label="Страна покупки" placeholder="Япония, Корея, Китай..." />
            <Field label="Имя" placeholder="Ваше имя" />
            <div className="md:col-span-2">
              <Field label="Телефон" type="tel" placeholder="+7 (___) ___-__-__" />
            </div>
          </div>
          <button type="submit" className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-blood px-8 py-4 text-sm font-medium tracking-[0.25em] text-primary-foreground shadow-red transition-all hover:bg-blood/90">
            ПОЛУЧИТЬ РАСЧЁТ
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-center text-[11px] tracking-wider text-silver-dim">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.3em] text-silver-dim mb-2">{label.toUpperCase()}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border-0 border-b border-border bg-transparent py-3 text-foreground placeholder:text-silver-dim/60 outline-none transition-colors focus:border-blood"
      />
    </label>
  );
}

const ADVANTAGES = [
  { icon: ShieldCheck, title: "Прозрачная сделка", text: "Вам предоставляются все отчёты об операциях и действиях по поиску, проверке, покупке и перевозке авто до вас." },
  { icon: Search, title: "Проверка авто", text: "Кузов, двигатель, подвеска, документы и история автомобиля." },
  { icon: Banknote, title: "Выгода покупки", text: "Находим автомобили с реальной экономией относительно рынка РФ." },
  { icon: Truck, title: "Доставка под ключ", text: "Логистика, документы, таможня и полное сопровождение сделки." },
  { icon: FileLock2, title: "Защита клиента", text: "Работаем по договору и фиксируем все условия до начала сделки." },
  { icon: Camera, title: "Отчёты на каждом этапе", text: "Фото, видео и статусы без неопределённости и догадок." },
];

function Advantages() {
  return (
    <section id="advantages" className="py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHead eyebrow="ПРЕИМУЩЕСТВА" title={<>Почему клиенты выбирают<br /><span className="text-blood font-semibold">SAMURA AUTO</span></>} />
        <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a, i) => (
            <div key={i} className="reveal group relative bg-background p-10 transition-all duration-500 hover:bg-graphite/60">
              <div className="absolute left-0 top-0 h-0 w-px bg-blood transition-all duration-500 group-hover:h-full" />
              <a.icon className="h-8 w-8 text-blood" strokeWidth={1.2} />
              <h3 className="mt-8 text-xl font-medium text-foreground">{a.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-silver-dim">{a.text}</p>
              <div className="mt-8 text-[10px] tracking-[0.4em] text-silver-dim">0{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  ["Заявка и консультация", "Уточняем задачу, бюджет и пожелания к авто."],
  ["Подбор автомобиля и заключение договора", "Анализируем аукционы и площадки в выбранной стране."],
  ["Осмотр и согласование", "Делаем полную диагностику авто с фото- и видеоотчётом, обсуждаем с клиентом."],
  ["Выкуп", "Покупаем автомобиль с аукциона или площадки в выбранной стране."],
  ["Логистика и документы", "Транспортировка, таможня, оформление всех документов."],
  ["Доставка в город", "Привозим автомобиль на стоянку или к клиенту."],
  ["Передача и ключи", "Финальная проверка и передача автомобиля владельцу."],
];

function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-graphite/40 py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHead eyebrow="ПРОЦЕСС" title={<>Семь этапов <span className="text-white font-semibold">до авто вашей мечты</span></>} />
        <div className="mt-20 grid gap-px bg-border lg:grid-cols-7">
          {STEPS.map(([title, text], i) => (
            <div key={i} className="reveal relative bg-background p-8 transition-colors hover:bg-graphite/60">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <span className="text-3xl font-light text-metal">0{i + 1}</span>
                <span className="text-[9px] tracking-[0.3em] text-blood">ЭТАП</span>
              </div>
              <h3 className="mt-6 text-base font-medium leading-snug text-foreground">{title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-silver-dim">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const COUNTRIES = ["Все", "Япония", "Китай", "Корея"] as const;
type Country = (typeof COUNTRIES)[number];

function Catalog() {
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
    <section id="catalog" className="py-24 lg:py-40">
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

        {/* Filters bar */}
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
    </section>
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

const STATS = [
  { num: "21", suf: "дн", label: "Сроки доставки от" },
  { num: "100", suf: "%", label: "Сопровождение сделки" },
  { num: "6+", suf: "лет", label: "Опыта работы" },
  { num: "900+", suf: "", label: "Довольных клиентов" },
  { num: "30", suf: "%", label: "Экономия до" },
];

function Numbers() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-background py-24 lg:py-32">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-32 left-1/2 h-96 w-[80%] -translate-x-1/2 rounded-full bg-blood/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <div key={i} className="reveal text-center">
              <div className="flex items-baseline justify-center gap-1">
                <div className="num-metal text-6xl font-extralight tracking-tighter md:text-7xl">{s.num}</div>
                {s.suf && <div className="text-2xl font-light text-blood">{s.suf}</div>}
              </div>
              <div className="mt-4 text-[11px] tracking-[0.3em] text-silver-dim">{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-24 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-10">
        <div className="reveal">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-blood" />
            <span className="text-[11px] tracking-[0.5em] text-silver-dim">О КОМПАНИИ</span>
          </div>
          <h2 className="text-4xl font-light leading-tight md:text-5xl">
            Команда, которая<br />берёт <span className="text-blood font-semibold">ответственность</span>
          </h2>
        </div>
        <div className="reveal">
          <p className="text-lg leading-relaxed text-silver">
            <span className="font-semibold text-foreground">SAMURA AUTO</span> — команда,
            которая помогает клиентам покупать автомобили за рубежом спокойно,
            прозрачно и выгодно.
          </p>
          <p className="mt-6 leading-relaxed text-silver-dim">
            Мы берём на себя подбор, проверку, выкуп, доставку и оформление, чтобы
            клиент получал не просто автомобиль, а уверенность в каждом решении.
            Каждая сделка ведётся по договору, каждое решение согласовывается
            с владельцем.
          </p>
          <a href="#contacts" className="mt-10 inline-flex items-center gap-3 border border-border px-8 py-4 text-sm tracking-[0.25em] text-foreground transition-all hover:border-blood hover:text-blood">
            СВЯЗАТЬСЯ С НАМИ
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

const RISKS = [
  { icon: AlertTriangle, title: "Скрытые повреждения" },
  { icon: Gauge, title: "Скрученный пробег" },
  { icon: FileWarning, title: "Проблемы с документами" },
  { icon: History, title: "Непонятная история авто" },
  { icon: CreditCard, title: "Ошибки в оплате и доставке" },
  { icon: AlertOctagon, title: "Неожиданные расходы" },
];

function Risks() {
  return (
    <section className="bg-graphite/40 py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHead eyebrow="РИСКИ" title={<>Почему самостоятельная покупка<br /><span className="text-blood font-semibold">может быть опасной</span></>} />
        <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {RISKS.map((r, i) => (
            <div key={i} className="reveal flex items-center gap-6 bg-background p-8">
              <r.icon className="h-7 w-7 shrink-0 text-blood" strokeWidth={1.2} />
              <span className="text-lg font-light text-foreground">{r.title}</span>
            </div>
          ))}
        </div>
        <div className="reveal mt-16 relative overflow-hidden border border-border bg-background p-12 lg:p-16">
          <div className="absolute left-0 top-0 h-full w-1 bg-blood" />
          <p className="text-2xl font-light leading-snug text-foreground md:text-3xl">
            <span className="text-blood">SAMURA AUTO</span> берёт эти риски на себя
            и ведёт сделку до момента передачи ключей.
          </p>
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  { name: "Ольга Лазуткина", city: "Иркутск", car: "Volkswagen Golf", text: "Сделка прошла очень быстро и максимально комфортно — ребята всегда были на связи, отвечали мгновенно и по делу. Отдельное спасибо за дружелюбное и человеческое отношение: чувствуешь, что тебе действительно хотят помочь, а не просто продать. Машину получила точно в срок и в идеальном состоянии. Команда — большие профессионалы своего дела!" },
  { name: "Елена Калабина", city: "Иркутск", car: "Toyota Sienta", text: "Всё чётко, прозрачно и по-человечески. Машина — огонь, состояние идеальное, как и обещали. Спасибо команде за терпение и заботу!" },
  { name: "Ваге Оганнесян", city: "Краснодар", car: "Geely Coolray", text: "Хотел Coolray давно, но боялся связываться с пригоном самостоятельно. Ребята всё взяли на себя: подбор, проверку, выкуп, доставку. На каждом этапе — фото, видео, отчёты. Никаких сюрпризов, никаких «доплатите ещё». Цена оказалась даже немного ниже первоначального расчёта. Машина приехала ровно тогда, когда обещали. Очень доволен, рекомендую всем своим друзьям!" },
  { name: "Пётр Смирнов", city: "Москва", car: "Honda Vezel", text: "Эмоции переполняют! Vezel пришёл свежий, ухоженный, ровно такой, как на фото с аукциона. Парни — молодцы, всё объяснили простым языком, провели за руку через каждый этап. Спасибо, ребята, вы лучшие!" },
  { name: "Евгений Прохоров", city: "Хабаровск", car: "Toyota Corolla Fielder", text: "Заказывал Fielder для семьи. Понравился системный подход — расчёт до рубля, договор, прозрачные сроки. Команда отвечала на любые вопросы, даже самые глупые, и ни разу не дала повода усомниться. Машина в отличном состоянии, документы оформили без нервов. Спасибо за честную работу." },
  { name: "Андрей Михайлов", city: "Иркутск", car: "Geely Coolray", text: "Брал Coolray для жены — она в восторге. Спасибо, что подобрали именно тот комплект, который искали." },
  { name: "Марина Соколова", city: "Иркутск", car: "Chery Tiggo 3x", text: "Это была моя первая машина из-за границы, и я очень переживала. Ребята буквально за руку провели через весь процесс — объяснили каждый шаг, прислали кучу фото и видео с аукциона, помогли с документами. Tiggo приехал ровно через месяц, без единой царапины, как и обещали. Очень рекомендую!" },
  { name: "Сергей Тарасов", city: "Иркутск", car: "BMW X1", text: "X1 пришёл идеальный, как с витрины. Сэкономил почти 600 тысяч по сравнению с местным рынком. Парни — красавчики!" },
  { name: "Наталья Кузнецова", city: "Иркутск", car: "Audi A3", text: "Долго выбирала между несколькими вариантами, и команда не давила, а спокойно помогала сравнивать. В итоге взяла A3 — машина мечты. Привезли быстро, без нервов и доплат. Огромное спасибо за терпение!" },
  { name: "Денис Поляков", city: "Иркутск", car: "Changan CS35 Plus", text: "Всё чётко. Цена, сроки, состояние — всё совпало с тем, о чём договаривались. Никакой воды и пустых обещаний." },
  { name: "Анастасия Белова", city: "Иркутск", car: "Geely Emgrand", text: "Ребята, спасибо вам огромное! Emgrand просто прелесть, езжу и радуюсь каждый день. Сделка прошла легко, как будто у соседа машину купила — настолько по-доброму всё было организовано. Буду советовать вас всем знакомым!" },
  { name: "Виктор Ермолаев", city: "Иркутск", car: "BMW 1 Series", text: "Брал 1 серию, остался доволен на 100%. Профессионалы своего дела." },
  { name: "Юлия Дмитриева", city: "Иркутск", car: "Chevrolet Monza", text: "Очень внимательное отношение к клиенту. Все вопросы — а их было много — разобрали спокойно и подробно. Машина приехала точно в срок, состояние супер. Ставлю твёрдую пятёрку!" },
  { name: "Алексей Жуков", city: "Москва", car: "BMW X2", text: "Заказывал X2, всё прошло как по нотам. Договор, оплата по этапам, отчёты — всё прозрачно. Сэкономил прилично и получил именно то, что хотел." },
  { name: "Кирилл Орлов", city: "Москва", car: "Audi Q3", text: "Спасибо за честную работу и за то, что не пытались навязать что-то не моё." },
  { name: "Светлана Гусева", city: "Москва", car: "Ford Focus", text: "Боялась связываться с пригоном, но ребята развеяли все страхи. Focus приехал в идеале, документы оформили быстро. Очень рада, что обратилась именно сюда!" },
  { name: "Рустам Сафин", city: "Казань", car: "Geely Binrui", text: "Машиной доволен полностью. Binrui — отличный выбор за свои деньги, и команда помогла его взять без переплат. Рекомендую от души." },
  { name: "Лилия Хасанова", city: "Казань", car: "Chery Tiggo 3x", text: "Очень душевные ребята. Помимо профессионализма, чувствуется живое отношение к каждому клиенту. Tiggo радует, спасибо!" },
  { name: "Артур Галиев", city: "Уфа", car: "Geely Coolray", text: "Сделка прошла быстро и без головной боли. Coolray приехал такой, как и обещали — без скрытых проблем. Цена честная, никаких накруток в процессе. Спасибо!" },
  { name: "Эльвира Нуриева", city: "Уфа", car: "BMW 2 Series", text: "Всё на высшем уровне. Машина — мечта, обслуживание — топ." },
  { name: "Михаил Лебедев", city: "Новосибирск", car: "BMW X1", text: "Заказал X1, привезли за 28 дней. Все этапы — фото, видео, отчёты от инспектора с аукциона. Никаких сюрпризов в финале. Парни знают своё дело." },
  { name: "Ольга Карпова", city: "Новосибирск", car: "Audi A1", text: "Маленькая, шустрая, моя! Спасибо, что нашли именно такую комплектацию, которую я хотела. Очень внимательные ребята." },
  { name: "Дмитрий Соловьёв", city: "Новосибирск", car: "Chevrolet Trailblazer", text: "Хороший сервис, грамотный подбор, честный расчёт. Trailblazer оказался даже лучше, чем я ожидал по фото. Команда — большие молодцы, рекомендую всем, кто хочет привезти машину без рисков." },
  { name: "Тимур Назаров", city: "Челябинск", car: "Geely Emgrand L", text: "Всё отлично. Машина в идеале, документы без замечаний, сроки выдержаны." },
  { name: "Полина Зайцева", city: "Челябинск", car: "Chevrolet Malibu", text: "Очень довольна! Malibu — красавица, состояние как у новой. Сделка прошла спокойно и понятно: ни одного момента, где бы я растерялась. Спасибо за заботу и профессионализм!" },
];

function Reviews() {
  const [idx, setIdx] = useState(0);
  const total = REVIEWS.length;
  return (
    <section id="reviews" className="py-24 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHead eyebrow="ОТЗЫВЫ" title={<>Что говорят <span className="text-blood font-semibold">клиенты</span></>} />
        <div className="reveal mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass-card relative p-10 lg:p-16">
            <div className="absolute left-10 top-10 text-7xl font-light text-blood/30">"</div>
            <p className="relative text-2xl font-light leading-snug text-foreground md:text-3xl">
              {REVIEWS[idx].text}
            </p>
            <div className="mt-10 flex items-end justify-between border-t border-border pt-8">
              <div>
                <div className="text-lg font-medium text-foreground">{REVIEWS[idx].name}</div>
                <div className="mt-1 text-xs tracking-[0.25em] text-silver-dim">
                  {REVIEWS[idx].city.toUpperCase()} · {REVIEWS[idx].car.toUpperCase()}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIdx((idx - 1 + total) % total)}
                  className="border border-border p-3 transition-colors hover:border-blood hover:text-blood">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setIdx((idx + 1) % total)}
                  className="border border-border p-3 transition-colors hover:border-blood hover:text-blood">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {REVIEWS.map((r, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`flex w-full items-center gap-4 border px-6 py-4 text-left transition-all ${
                    idx === i ? "border-blood bg-graphite/60" : "border-border hover:border-silver/40"
                  }`}>
                  <span className={`text-xs tracking-[0.3em] ${idx === i ? "text-blood" : "text-silver-dim"}`}>0{i+1}</span>
                  <span className="flex-1 text-sm text-foreground">{r.name}</span>
                  <span className="text-[10px] tracking-[0.2em] text-silver-dim">{r.car}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  ["Как происходит процесс покупки автомобиля?", "Мы фиксируем задачу, подбираем варианты на зарубежных аукционах, проводим осмотр и согласование с вами, выкупаем автомобиль, оформляем документы и доставляем в ваш город."],
  ["Сколько занимает доставка?", "От 21 дня. Точный срок зависит от страны происхождения, способа доставки и текущей загрузки логистики."],
  ["Как происходит оплата?", "Все этапы фиксируются договором. Оплата производится поэтапно: предоплата за подбор, оплата за автомобиль и финальный расчёт за доставку и услуги."],
  ["Можно ли заказать автомобиль в свой город?", "Да. Мы организуем доставку автомобиля до терминала или до адреса в любом городе России."],
  ["Какие гарантии я получаю?", "Договор с фиксацией условий, отчёты на каждом этапе, проверка автомобиля профильным экспертом, прозрачная финансовая модель."],
  ["Что входит в услугу под ключ?", "Подбор, проверка, выкуп, оплата, логистика, таможня, оформление документов и передача автомобиля клиенту."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-graphite/40 py-24 lg:py-40">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <SectionHead eyebrow="FAQ" title={<>Частые <span className="text-blood font-semibold">вопросы</span></>} center />
        <div className="mt-16 divide-y divide-border border-y border-border">
          {FAQ.map(([q, a], i) => (
            <div key={i} className="reveal">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-7 text-left transition-colors hover:text-blood">
                <span className="text-lg font-light text-foreground md:text-xl">{q}</span>
                {open === i ? <Minus className="h-5 w-5 text-blood shrink-0" /> : <Plus className="h-5 w-5 text-silver-dim shrink-0" />}
              </button>
              <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="max-w-3xl text-base leading-relaxed text-silver-dim">{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="contacts" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={ctaCar} alt="" loading="lazy" width={1920} height={900} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
      </div>
      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-6 py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10 lg:py-40">
        <div className="reveal">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-blood" />
            <span className="text-[11px] tracking-[0.5em] text-silver-dim">КОНТАКТЫ</span>
          </div>
          <h2 className="text-4xl font-light leading-[1.05] md:text-5xl lg:text-6xl">
            Хотите привезти авто<br />
            <span className="text-blood font-semibold">без лишних рисков?</span>
          </h2>
          <p className="mt-8 max-w-lg text-lg text-silver-dim">
            Оставьте заявку — рассчитаем стоимость, сроки и лучшие варианты под ваш бюджет.
          </p>
          <div className="mt-12 space-y-6">
            <ContactRow icon={Phone} label="ТЕЛЕФОН" value="8 950 060 51 80" href="tel:+79500605180" />
            <ContactRow icon={Send} label="TELEGRAM" value="@samurauto" href="https://t.me/samurauto" />
            <ContactRow icon={MessageCircle} label="MAX" value="8 950 060 51 80" href="tel:+79500605180" />
            <ContactRow icon={MapPin} label="АДРЕС" value="г. Иркутск, ул. Угольный проезд 68/3" />
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert("Заявка отправлена."); }}
          className="reveal glass-card p-8 lg:p-12">
          <div className="space-y-6">
            <Field label="Имя" placeholder="Ваше имя" />
            <Field label="Телефон" type="tel" placeholder="+7 (___) ___-__-__" />
            <Field label="Желаемый авто" placeholder="Марка / модель" />
            <Field label="Желаемый бюджет" placeholder="до 5 000 000 ₽" />
          </div>
          <button type="submit" className="group mt-10 inline-flex w-full items-center justify-center gap-3 bg-blood px-8 py-4 text-sm font-medium tracking-[0.25em] text-primary-foreground shadow-red transition-all hover:bg-blood/90">
            ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const content = (
    <>
      <Icon className="h-5 w-5 text-blood" strokeWidth={1.4} />
      <div>
        <div className="text-[10px] tracking-[0.3em] text-silver-dim">{label}</div>
        <div className="mt-1 text-lg text-foreground">{value}</div>
      </div>
    </>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="flex items-center gap-6 border-b border-border pb-5 transition-colors hover:text-blood">
        {content}
      </a>
    );
  }
  return <div className="flex items-center gap-6 border-b border-border pb-5">{content}</div>;
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="h-10 w-10 object-contain" width={40} height={40} loading="lazy" />
              <div>
                <div className="text-sm font-semibold tracking-[0.28em] text-metal">SAMURA</div>
                <div className="text-[10px] tracking-[0.42em] text-blood">AUTO</div>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-silver-dim">
              Импорт автомобилей из Азии, Европы и США. Подбор, проверка, выкуп и доставка под ключ.
            </p>
          </div>
          <FooterCol title="НАВИГАЦИЯ" items={NAV.map(n => n.label)} />
          <FooterCol title="КОНТАКТЫ" items={["+7 (800) 555-00-00", "@samura_auto", "Владивосток"]} />
          <div>
            <div className="text-[10px] tracking-[0.4em] text-silver">ДОКУМЕНТЫ</div>
            <ul className="mt-6 space-y-3">
              <li><a href="/privacy" className="text-sm text-silver-dim transition-colors hover:text-blood">Политика конфиденциальности</a></li>
              <li><a href="#" className="text-sm text-silver-dim transition-colors hover:text-blood">Реквизиты компании</a></li>
              <li><a href="#" className="text-sm text-silver-dim transition-colors hover:text-blood">Договор оферты</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-silver-dim md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} SAMURA AUTO. Все права защищены.</div>
          <div className="tracking-[0.3em]">ИМПОРТ · УВЕРЕННОСТЬ · ПОД КЛЮЧ</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.4em] text-silver">{title}</div>
      <ul className="mt-6 space-y-3">
        {items.map((i) => (
          <li key={i}><a href="#" className="text-sm text-silver-dim transition-colors hover:text-blood">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}

function SectionHead({ eyebrow, title, center, className = "" }: { eyebrow: string; title: React.ReactNode; center?: boolean; className?: string }) {
  return (
    <div className={`reveal ${center ? "text-center" : ""} ${className}`}>
      <div className={`mb-6 flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <span className="h-px w-10 bg-blood" />
        <span className="text-[11px] tracking-[0.5em] text-silver-dim">{eyebrow}</span>
        {center && <span className="h-px w-10 bg-blood" />}
      </div>
      <h2 className="text-4xl font-light leading-[1.05] md:text-5xl lg:text-[64px]">{title}</h2>
    </div>
  );
}

function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <HeroForm />
        <Advantages />
        <Process />
        <Catalog />
        <Numbers />
        <About />
        <Risks />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
