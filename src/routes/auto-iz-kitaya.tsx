import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, buildBreadcrumbJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/auto-iz-kitaya";

export const Route = createFileRoute("/auto-iz-kitaya")({
  head: () => ({
    meta: [
      { title: "Авто из Китая под заказ — подбор, выкуп и доставка | SAMURA AUTO" },
      { name: "description", content: "Привозим автомобили из Китая: Li Auto, Zeekr, Nio, BYD, Tank, Hongqi, Voyah. Подбор, выкуп у дилера, доставка и растаможка под ключ." },
      { property: "og:title", content: "Авто из Китая под заказ | SAMURA AUTO" },
      { property: "og:description", content: "Подбор китайских авто у дилеров и на вторичке, выкуп, доставка и растаможка под ключ." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: "Главная", url: "https://samura-auto.ru/" },
          { name: "Авто из Китая", url: URL },
        ])),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout
      eyebrow="НАПРАВЛЕНИЕ · КИТАЙ"
      title={<>Авто из <span className="text-blood font-semibold">Китая</span> под заказ</>}
      lead="Привозим новые и подержанные автомобили из Китая: Li Auto, Zeekr, Nio, BYD, Tank, Hongqi, Voyah, AITO. Работаем с официальными дилерами и проверенными вторичными площадками."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Авто из Китая" }]}
    >
      <ContentSection heading="Почему Китай">
        <p>Китайский авторынок стремительно растёт и сегодня предлагает технологичные внедорожники, гибриды и электромобили, которые недоступны или избыточно дороги в России. Многие модели не имеют аналогов по уровню оснащения в своём ценовом сегменте.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "Дилерская сеть в Китае", text: "Прямые поставки от официальных дилеров." },
        { title: "Подбор по характеристикам", text: "Помогаем выбрать модель под задачи и бюджет." },
        { title: "Доставка через Маньчжурию", text: "Сухопутная логистика — оптимальные сроки." },
        { title: "Сертификация и растаможка", text: "Оформление документов под РФ под ключ." },
      ]} />

      <ContentSection heading="Популярные модели из Китая">
        <p>Li Auto L7/L8/L9/Mega, Zeekr 001/007/009/X, AITO M7/M9, Tank 300/400/500/700, BYD Han, Tang, Yangwang, Voyah Free и Dream, Hongqi H9, HS7, EH7, Nio ES6/ES8, ET5/ET7. Привозим как новые автомобили, так и проверенные с пробегом.</p>
      </ContentSection>

      <ContentSection heading="Сроки и стоимость">
        <p>Средний срок — от 30 до 50 дней. В стоимость включены подбор, выкуп, доставка до РФ, растаможка и сопровождение. На электромобили и гибриды действуют особые правила сертификации — мы берём их полностью на себя.</p>
      </ContentSection>
    </SubpageLayout>
  );
}
