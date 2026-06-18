import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, buildBreadcrumbJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/uslugi/dostavka-i-rastamozhka";

export const Route = createFileRoute("/uslugi/dostavka-i-rastamozhka")({
  head: () => ({
    meta: [
      { title: "Доставка и растаможка авто — услуга SAMURA AUTO" },
      { name: "description", content: "Доставка автомобилей из Японии, Кореи, Китая, Европы и США в Россию. Морская и сухопутная логистика, растаможка, СБКТС, ЭПТС, постановка на учёт." },
      { property: "og:title", content: "Доставка и растаможка авто | SAMURA AUTO" },
      { property: "og:description", content: "Морская и сухопутная логистика, растаможка, оформление СБКТС, ЭПТС и постановка на учёт." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: "Главная", url: "https://samura-auto.ru/" },
          { name: "Услуги", url: URL },
          { name: "Доставка и растаможка", url: URL },
        ])),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Доставка и растаможка автомобилей",
          provider: { "@type": "Organization", name: "SAMURA AUTO", url: "https://samura-auto.ru" },
          areaServed: "RU",
          serviceType: "Логистика и таможенное оформление автомобилей",
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout
      eyebrow="УСЛУГА"
      title={<>Доставка и <span className="text-blood font-semibold">растаможка</span> авто</>}
      lead="Берём на себя полный цикл логистики и таможенного оформления: морская и сухопутная доставка, растаможка, СБКТС, ЭПТС и постановка на учёт в России."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Доставка и растаможка" }]}
    >
      <ContentSection heading="Что входит">
        <p>После выкупа автомобиля мы организуем его доставку из страны покупки до вашего города. Морская перевозка через Владивосток, Новороссийск, Санкт-Петербург или сухопутная через Маньчжурию и Беларусь — выбираем оптимальный маршрут.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "Морская и сухопутная логистика", text: "Контейнер, ро-ро, автовоз, ж/д." },
        { title: "Таможенное оформление", text: "Расчёт пошлин и полная процедура декларации." },
        { title: "СБКТС и ЭПТС", text: "Лабораторное заключение и электронный ПТС." },
        { title: "Постановка на учёт", text: "Помощь в подготовке документов для ГИБДД." },
      ]} />

      <ContentSection heading="Прозрачная стоимость">
        <p>Стоимость доставки и растаможки рассчитываем заранее — до момента покупки автомобиля. Вы видите итоговую цену «под ключ» и принимаете решение без сюрпризов в конце сделки.</p>
      </ContentSection>
    </SubpageLayout>
  );
}
