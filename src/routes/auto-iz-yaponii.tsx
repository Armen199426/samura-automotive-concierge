import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, buildBreadcrumbJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/auto-iz-yaponii";

export const Route = createFileRoute("/auto-iz-yaponii")({
  head: () => ({
    meta: [
      { title: "Авто из Японии под заказ — подбор, выкуп и доставка | SAMURA AUTO" },
      { name: "description", content: "Привозим автомобили из Японии под заказ: подбор на аукционах USS, JU, TAA, проверка, выкуп, доставка и растаможка под ключ." },
      { property: "og:title", content: "Авто из Японии под заказ | SAMURA AUTO" },
      { property: "og:description", content: "Подбор на японских аукционах, проверка, выкуп и доставка авто из Японии в Россию под ключ." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: "Главная", url: "https://samura-auto.ru/" },
          { name: "Авто из Японии", url: URL },
        ])),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout
      eyebrow="НАПРАВЛЕНИЕ · ЯПОНИЯ"
      title={<>Авто из <span className="text-blood font-semibold">Японии</span> под заказ</>}
      lead="Подбираем автомобили на крупнейших японских аукционах — USS, JU, TAA, Arai, HAA Kobe. Полная проверка, выкуп, доставка и растаможка под ключ."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Авто из Японии" }]}
    >
      <ContentSection heading="Почему Япония">
        <p>Япония — один из самых прозрачных авторынков мира. Аукционные листы фиксируют пробег, состояние кузова, салона и техническую часть, а сами автомобили обслуживаются по строгим регламентам. Это позволяет нам подбирать машины с реальным пробегом и без скрытых проблем.</p>
        <p>SAMURA AUTO работает напрямую с японскими аукционами и партнёрами в портах Иокогама, Кобе и Нагоя — без посредников и наценок.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "Аукционы USS, JU, TAA", text: "Доступ к десяткам тысяч автомобилей еженедельно." },
        { title: "Проверка по аукционному листу", text: "Расшифровка оценки кузова, салона и тех. состояния." },
        { title: "Выкуп и логистика", text: "Оплата, отправка из порта, морская перевозка и таможня." },
        { title: "Растаможка под клиента", text: "Расчёт пошлин и оформление по физлицу или юрлицу." },
      ]} />

      <ContentSection heading="Популярные модели из Японии">
        <p>Toyota Land Cruiser, Lexus LX, Toyota Alphard и Vellfire, Lexus RX, Toyota Harrier, Honda Vezel, Toyota Prius, Nissan X-Trail, Mazda CX-5 — модели, которые мы привозим регулярно. Сегмент: гибриды, минивэны, премиальные внедорожники и бизнес-седаны.</p>
      </ContentSection>

      <ContentSection heading="Сроки и стоимость">
        <p>Средний срок доставки из Японии в Россию — от 30 до 60 дней с момента покупки на аукционе. В стоимость включены: подбор, аукционный сбор, выкуп, доставка до порта РФ, растаможка и доставка в ваш город.</p>
      </ContentSection>
    </SubpageLayout>
  );
}
