import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, buildBreadcrumbJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/auto-iz-ssha";

export const Route = createFileRoute("/auto-iz-ssha")({
  head: () => ({
    meta: [
      { title: "Авто из США под заказ — подбор, выкуп и доставка | SAMURA AUTO" },
      { name: "description", content: "Привозим автомобили из США с аукционов Copart, IAAI, Manheim. Подбор, проверка, выкуп, доставка контейнером и растаможка под ключ." },
      { property: "og:title", content: "Авто из США под заказ | SAMURA AUTO" },
      { property: "og:description", content: "Подбор на Copart, IAAI и Manheim, выкуп, доставка контейнером и растаможка авто из США под ключ." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: "Главная", url: "https://samura-auto.ru/" },
          { name: "Авто из США", url: URL },
        ])),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout
      eyebrow="НАПРАВЛЕНИЕ · США"
      title={<>Авто из <span className="text-blood font-semibold">США</span> под заказ</>}
      lead="Работаем с аукционами Copart, IAAI и дилерскими площадками Manheim, AutoTrader, Cars.com. Подбор, выкуп, контейнерная доставка и растаможка под ключ."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Авто из США" }]}
    >
      <ContentSection heading="Почему США">
        <p>США — это огромный выбор автомобилей, эксклюзивные модели (мускул-кары, пикапы, кроссоверы) и привлекательные цены на премиум-сегмент. Подходит и для покупки целых автомобилей, и для проектов с восстановлением.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "Copart, IAAI, Manheim", text: "Прозрачные торги и большая база предложений." },
        { title: "Проверка по VIN (Carfax)", text: "История ДТП, пробег, владельцы, угоны." },
        { title: "Контейнерная доставка", text: "Через порты Нью-Йорка, Лос-Анджелеса, Хьюстона." },
        { title: "Растаможка в РФ", text: "Расчёт пошлин и полное оформление." },
      ]} />

      <ContentSection heading="Популярные модели из США">
        <p>Tesla Model S/X/3/Y, Cadillac Escalade, Ford F-150, Raptor, Bronco, Chevrolet Tahoe, Suburban, Dodge Ram, Jeep Grand Cherokee, Wrangler, Lexus и Toyota в американских комплектациях. Часто привозим электромобили — рынок США один из крупнейших по EV.</p>
      </ContentSection>

      <ContentSection heading="Сроки и стоимость">
        <p>Средний срок доставки из США — от 45 до 75 дней. В стоимость включены подбор, выкуп на аукционе, доставка до порта, морская перевозка, растаможка и сопровождение документов.</p>
      </ContentSection>
    </SubpageLayout>
  );
}
