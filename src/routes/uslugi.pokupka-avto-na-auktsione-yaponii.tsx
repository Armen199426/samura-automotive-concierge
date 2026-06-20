import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout, ContentSection, FeatureGrid, Steps, FaqList, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/components/SubpageLayout";

const URL = "https://samura-auto.ru/uslugi/pokupka-avto-na-auktsione-yaponii";

const FAQ = [
  { q: "Какие аукционы Японии вы используете?", a: "USS, JU, TAA, Arai, HAA Kobe и другие крупные площадки. Доступ к десяткам тысяч автомобилей еженедельно по всей Японии." },
  { q: "Чем отличаются USS, TAA и JU?", a: "USS — крупнейшая аукционная сеть Японии. TAA — аукцион группы Toyota с большим объёмом Lexus и Toyota. JU — региональные площадки с фокусом на массовый сегмент. Мы подбираем оптимальную под задачу клиента." },
  { q: "Как купить авто с аукциона Японии?", a: "Зарегистрировать ставку напрямую невозможно — нужен аккредитованный участник. SAMURA AUTO выступает таким участником и выкупает автомобиль по согласованной с клиентом ставке." },
  { q: "Что такое аукционный лист?", a: "Это официальный документ аукциона с оценкой кузова, салона, технического состояния и пробега. По нему можно объективно судить о состоянии автомобиля ещё до выкупа." },
  { q: "Сколько времени занимает покупка на аукционе?", a: "Сам выкуп — один торговый день. Полный цикл от ставки до доставки в Россию — 30–60 дней." },
  { q: "Можно ли увидеть автомобиль до выкупа?", a: "Да. По запросу организуем выездной осмотр автомобиля на стоянке аукциона до момента ставки." },
];

export const Route = createFileRoute("/uslugi/pokupka-avto-na-auktsione-yaponii")({
  head: () => ({
    meta: [
      { title: "Покупка авто на аукционах Японии — USS, TAA, JU | SAMURA AUTO" },
      { name: "description", content: "Покупка автомобилей на японских аукционах USS, TAA, JU, Arai, HAA Kobe под ключ. Подбор, расшифровка аукционного листа, выкуп, доставка и растаможка." },
      { property: "og:title", content: "Покупка авто с аукциона Японии | SAMURA AUTO" },
      { property: "og:description", content: "Прямой доступ к японским аукционам USS, TAA, JU. Подбор, выкуп, доставка под ключ." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(buildBreadcrumbJsonLd([
        { name: "Главная", url: "https://samura-auto.ru/" },
        { name: "Услуги", url: URL },
        { name: "Аукционы Японии", url: URL },
      ])) },
      { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Покупка автомобиля на аукционе Японии",
        provider: { "@type": "Organization", name: "SAMURA AUTO", url: "https://samura-auto.ru" },
        areaServed: "RU",
        serviceType: "Покупка автомобилей на японских аукционах",
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
      eyebrow="УСЛУГА · АУКЦИОНЫ ЯПОНИИ"
      title={<>Покупка авто на <span className="text-blood font-semibold">аукционах Японии</span></>}
      lead="Прямой доступ к японским аукционам USS, TAA, JU, Arai и HAA Kobe. Подбор, расшифровка аукционного листа, выкуп и доставка автомобиля в Россию под ключ."
      breadcrumbs={[{ label: "Главная", href: "/" }, { label: "Аукционы Японии" }]}
    >
      <ContentSection heading="Почему японские аукционы">
        <p>Япония — один из самых прозрачных авторынков мира. Аукционные системы USS, TAA и JU фиксируют состояние каждого автомобиля по единой шкале и публикуют официальный аукционный лист до начала торгов.</p>
        <p>Это означает, что покупатель видит реальный пробег, оценку кузова, салона и техническую часть до того, как сделать ставку. SAMURA AUTO выступает аккредитованным участником и выкупает автомобиль по согласованной с клиентом цене.</p>
      </ContentSection>

      <FeatureGrid items={[
        { title: "USS", text: "Крупнейшая аукционная сеть Японии — десятки тысяч лотов в неделю." },
        { title: "TAA", text: "Аукцион группы Toyota — широкий выбор Lexus и Toyota." },
        { title: "JU", text: "Региональные площадки с массовым сегментом и гибридами." },
        { title: "Arai и HAA Kobe", text: "Премиальные и редкие модели по всей Японии." },
      ]} />

      <ContentSection heading="Как проходит покупка">
        <p>Покупка автомобиля на японском аукционе — это последовательность точных шагов с фиксированными сроками и стоимостью.</p>
      </ContentSection>

      <Steps items={[
        { title: "ТЗ и расчёт", text: "Согласуем модель, бюджет и расчёт стоимости под ключ." },
        { title: "Подбор лотов", text: "Подбираем варианты, расшифровываем аукционные листы." },
        { title: "Ставка и выкуп", text: "Делаем ставку в согласованных пределах, выкупаем лот." },
        { title: "Доставка в РФ", text: "Отправка из порта Японии, растаможка, передача клиенту." },
      ]} />

      <ContentSection heading="Что вы получаете">
        <p>Прозрачную цену с японского аукциона, расшифровку аукционного листа, фото- и видеоотчёты, фиксированную стоимость услуги и сопровождение до постановки автомобиля на учёт в России.</p>
      </ContentSection>

      <ContentSection heading="Частые вопросы">
        <p>Ответы на основные вопросы про покупку автомобилей на аукционах Японии.</p>
      </ContentSection>
      <FaqList items={FAQ} />
    </SubpageLayout>
  );
}
