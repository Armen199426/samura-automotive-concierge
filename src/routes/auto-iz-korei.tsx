import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, buildBreadcrumbJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/auto-iz-korei";

export const Route = createFileRoute("/auto-iz-korei")({
  head: () => ({
    meta: [
      { title: "Авто из Кореи под заказ — подбор, выкуп и доставка | SAMURA AUTO" },
      { name: "description", content: "Автомобили из Южной Кореи под заказ: Encar, KB Chachacha, Kcar. Подбор, проверка по VIN, выкуп, доставка морем и растаможка." },
      { property: "og:title", content: "Авто из Кореи под заказ | SAMURA AUTO" },
      { property: "og:description", content: "Подбор на корейских площадках, проверка, выкуп и доставка авто из Южной Кореи в Россию под ключ." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: "Главная", url: "https://samura-auto.ru/" },
          { name: "Авто из Кореи", url: URL },
        ])),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout
      eyebrow="НАПРАВЛЕНИЕ · ЮЖНАЯ КОРЕЯ"
      title={<>Авто из <span className="text-blood font-semibold">Кореи</span> под заказ</>}
      lead="Привозим автомобили из Южной Кореи с площадок Encar, KB Chachacha, Kcar. Проверка по VIN, выкуп, отправка из порта Пусан и растаможка под ключ."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Авто из Кореи" }]}
    >
      <ContentSection heading="Почему Корея">
        <p>Южная Корея — один из самых выгодных рынков по соотношению «цена / комплектация». Премиальные Genesis, Kia, Hyundai в богатых комплектациях стоят существенно дешевле российского рынка. Низкий пробег, обслуживание у официальных дилеров и развитая инфраструктура аукционов.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "Encar, KB Chachacha, Kcar", text: "Крупнейшие площадки с прозрачной историей." },
        { title: "Проверка по VIN и истории", text: "Carfax-аналог, ДТП, владельцы, ТО." },
        { title: "Отправка из порта Пусан", text: "Морская доставка во Владивосток и далее по РФ." },
        { title: "Растаможка под клиента", text: "Точный расчёт пошлин до выкупа." },
      ]} />

      <ContentSection heading="Популярные модели из Кореи">
        <p>Genesis G80, GV70, GV80, Kia K5, K8, Carnival, Sorento, Hyundai Palisade, Grandeur, Santa Fe, Ioniq 5/6. Активно везём гибриды и электромобили — рынок Кореи богат современными электрифицированными моделями.</p>
      </ContentSection>

      <ContentSection heading="Сроки доставки">
        <p>Средний срок — от 21 до 45 дней от момента выкупа до выдачи автомобиля в России. Стоимость включает подбор, выкуп, доставку, растаможку и сопровождение всех документов.</p>
      </ContentSection>
    </SubpageLayout>
  );
}
