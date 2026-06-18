import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, buildBreadcrumbJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/auto-iz-evropy";

export const Route = createFileRoute("/auto-iz-evropy")({
  head: () => ({
    meta: [
      { title: "Авто из Европы под заказ — подбор, выкуп и доставка | SAMURA AUTO" },
      { name: "description", content: "Автомобили из Германии, Польши, Литвы и других стран ЕС под заказ. Подбор по mobile.de, AutoScout24, проверка, выкуп и доставка." },
      { property: "og:title", content: "Авто из Европы под заказ | SAMURA AUTO" },
      { property: "og:description", content: "Подбор на mobile.de и AutoScout24, проверка, выкуп и доставка авто из Европы в Россию под ключ." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: "Главная", url: "https://samura-auto.ru/" },
          { name: "Авто из Европы", url: URL },
        ])),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout
      eyebrow="НАПРАВЛЕНИЕ · ЕВРОПА"
      title={<>Авто из <span className="text-blood font-semibold">Европы</span> под заказ</>}
      lead="Работаем с площадками mobile.de, AutoScout24 и дилерскими стоками Германии, Польши, Литвы. Подбор, выкуп через партнёров в ЕС, доставка и растаможка под ключ."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Авто из Европы" }]}
    >
      <ContentSection heading="Почему Европа">
        <p>Европейский рынок — это премиальный сегмент в богатых комплектациях, сервисная история у официальных дилеров и широкий выбор дизельных и спортивных версий, которые в РФ практически не представлены.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "mobile.de и AutoScout24", text: "Доступ к крупнейшим площадкам Европы." },
        { title: "Проверка партнёром на месте", text: "Осмотр, тест-драйв, фото и видео отчёт." },
        { title: "Выкуп и оформление", text: "Полный комплект документов и экспортный транзит." },
        { title: "Логистика в РФ", text: "Автовоз или контейнер, далее растаможка." },
      ]} />

      <ContentSection heading="Популярные модели из Европы">
        <p>BMW X5/X6/X7, Mercedes-Benz GLE, GLS, S-класс, E-класс, Audi Q7, Q8, A6 allroad, Porsche Cayenne, Macan, Volkswagen Touareg, Tiguan, Skoda Kodiaq. Везём как новые, так и с пробегом до 3-х лет.</p>
      </ContentSection>

      <ContentSection heading="Сроки доставки">
        <p>Средний срок — от 30 до 60 дней с учётом транзита через третьи страны и растаможки. Точные сроки рассчитываем индивидуально по конкретной модели и маршруту.</p>
      </ContentSection>
    </SubpageLayout>
  );
}
