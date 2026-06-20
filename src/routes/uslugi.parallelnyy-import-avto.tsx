import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, Steps, FaqList, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/uslugi/parallelnyy-import-avto";

const FAQ = [
  { q: "Что такое параллельный импорт автомобилей?", a: "Это законный ввоз автомобилей в Россию в обход официальных дилерских каналов. Машина покупается на внутреннем рынке другой страны и легально оформляется в РФ через таможню." },
  { q: "Какие бренды можно ввезти по параллельному импорту?", a: "BMW, Mercedes-Benz, Audi, Porsche, Lexus, Toyota, Volkswagen, Land Rover, Genesis, Hyundai, Kia, Volvo и другие — список разрешённых марок регулярно расширяется." },
  { q: "Законен ли параллельный импорт в 2026 году?", a: "Да. Параллельный импорт легализован постановлением Правительства РФ и регулярно продлевается. Все автомобили оформляются официально, с уплатой пошлин, СБКТС и ЭПТС." },
  { q: "Есть ли гарантия на автомобиль по параллельному импорту?", a: "Заводская гарантия не действует в России для таких автомобилей. Мы помогаем подобрать сервис и в ряде случаев предлагаем расширенную страховую гарантию через партнёров." },
  { q: "Сколько стоит автомобиль по параллельному импорту?", a: "Цена включает стоимость авто на внутреннем рынке, логистику, таможенные платежи и услуги SAMURA AUTO. Расчёт фиксируем до выкупа." },
];

export const Route = createFileRoute("/uslugi/parallelnyy-import-avto")({
  head: () => ({
    meta: [
      { title: "Параллельный импорт автомобилей в Россию | SAMURA AUTO" },
      { name: "description", content: "Параллельный импорт автомобилей под ключ: BMW, Mercedes, Audi, Porsche, Lexus, Toyota и другие. Законная схема, прозрачные пошлины, СБКТС и ЭПТС." },
      { property: "og:title", content: "Параллельный импорт автомобилей | SAMURA AUTO" },
      { property: "og:description", content: "Легальный параллельный импорт автомобилей из-за рубежа. Подбор, выкуп, доставка, растаможка." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Главная", url: "https://samura-auto.ru/" },
        { name: "Услуги", url: URL },
        { name: "Параллельный импорт", url: URL },
      ])) },
      { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Параллельный импорт автомобилей",
        provider: { "@type": "Organization", name: "SAMURA AUTO", url: "https://samura-auto.ru" },
        areaServed: "RU",
        serviceType: "Параллельный импорт",
        url: URL,
      }) },
      { type: "application/ld+json", children: JSON.stringify(buildFaqJsonLd(FAQ)) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout
      eyebrow="УСЛУГА · ПАРАЛЛЕЛЬНЫЙ ИМПОРТ"
      title={<>Параллельный <span className="text-blood font-semibold">импорт</span> автомобилей</>}
      lead="Легальный ввоз автомобилей премиальных и массовых брендов в обход официальных дилерских каналов. Прозрачная схема, полное таможенное оформление, СБКТС и ЭПТС."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Параллельный импорт" }]}
    >
      <ContentSection heading="Что такое параллельный импорт">
        <p>Параллельный импорт — это законный ввоз автомобилей в Россию без участия официального дистрибьютора. Машина покупается на внутреннем рынке страны производителя или соседней страны, легально проходит таможню РФ и получает все необходимые документы для эксплуатации.</p>
        <p>SAMURA AUTO работает с разрешённым перечнем марок и моделей: BMW, Mercedes-Benz, Audi, Porsche, Lexus, Toyota, Volkswagen, Land Rover, Volvo и другие.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "Легальная схема", text: "Полное таможенное оформление, ГТД, СБКТС и ЭПТС." },
        { title: "Премиальные бренды", text: "BMW, Mercedes, Audi, Porsche, Lexus, Land Rover и другие." },
        { title: "Рыночные цены", text: "Покупка по цене внутреннего рынка страны происхождения." },
        { title: "Полное сопровождение", text: "Договор, отчёты, документы для постановки на учёт." },
      ]} />

      <ContentSection heading="Как мы организуем параллельный импорт">
        <p>Каждая сделка проходит по проверенной схеме — без серых каналов и без рисков для клиента.</p>
      </ContentSection>

      <Steps items={[
        { title: "Подбор и согласование", text: "ТЗ, страна закупки, расчёт стоимости под ключ." },
        { title: "Выкуп и контракт", text: "Оформляем договор и выкупаем автомобиль на площадке." },
        { title: "Доставка в РФ", text: "Логистика морем или сухопутно, страхование груза." },
        { title: "Таможня и документы", text: "Растаможка, СБКТС, ЭПТС, передача клиенту." },
      ]} />

      <ContentSection heading="Почему SAMURA AUTO">
        <p>Прямые контракты с площадками и логистами, юридическая прозрачность сделки, фиксированная стоимость услуги и опыт более 500 успешно завершённых импортных поставок.</p>
      </ContentSection>

      <ContentSection heading="Частые вопросы">
        <p>Ответы на основные вопросы клиентов про параллельный импорт автомобилей.</p>
      </ContentSection>
      <FaqList items={FAQ} />
    </SubpageLayout>
  );
}
