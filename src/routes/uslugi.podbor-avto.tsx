import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, buildBreadcrumbJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/uslugi/podbor-avto";

export const Route = createFileRoute("/uslugi/podbor-avto")({
  head: () => ({
    meta: [
      { title: "Подбор автомобиля под заказ — услуга SAMURA AUTO" },
      { name: "description", content: "Профессиональный подбор автомобилей на зарубежных аукционах и площадках. Аналитика, аукционные листы, проверка по VIN — выбираем лучший вариант под ваш бюджет." },
      { property: "og:title", content: "Подбор автомобиля под заказ | SAMURA AUTO" },
      { property: "og:description", content: "Профессиональный подбор автомобилей на зарубежных аукционах под ваш бюджет и задачи." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: "Главная", url: "https://samura-auto.ru/" },
          { name: "Услуги", url: "https://samura-auto.ru/uslugi/podbor-avto" },
          { name: "Подбор авто", url: URL },
        ])),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Подбор автомобиля под заказ",
          provider: { "@type": "Organization", name: "SAMURA AUTO", url: "https://samura-auto.ru" },
          areaServed: "RU",
          serviceType: "Подбор автомобиля на зарубежных аукционах",
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
      title={<>Подбор <span className="text-blood font-semibold">автомобиля</span> под заказ</>}
      lead="Подбираем автомобили на зарубежных аукционах и дилерских площадках под ваши задачи и бюджет. Анализируем рынок, расшифровываем аукционные листы, проверяем историю."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Подбор авто" }]}
    >
      <ContentSection heading="Что входит в подбор">
        <p>Подбор автомобиля — это не просто поиск по фильтру. Это аналитика рынка, экспертиза по конкретной модели, расшифровка аукционных листов, проверка по VIN и Carfax-аналогам, осмотр партнёром на месте и честная рекомендация.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "Брифинг и подбор стратегии", text: "Определяем модель, бюджет, страну и сроки." },
        { title: "Мониторинг площадок", text: "Ежедневный отбор подходящих вариантов." },
        { title: "Аналитика и расшифровка", text: "Аукционный лист, история, реальное состояние." },
        { title: "Согласование с клиентом", text: "Финальное решение всегда за вами." },
      ]} />

      <ContentSection heading="Когда подбор особенно нужен">
        <p>Редкие комплектации, ограниченный бюджет, конкретная цветовая гамма, поиск без скрытых ДТП, гибриды и электромобили с конкретной версией батареи — задачи, где экспертный подбор экономит время и деньги.</p>
      </ContentSection>
    </SubpageLayout>
  );
}
