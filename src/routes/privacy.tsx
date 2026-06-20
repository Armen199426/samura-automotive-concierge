import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — SAMURA AUTO" },
      { name: "description", content: "Политика обработки персональных данных и использования файлов cookie SAMURA AUTO." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [
      { rel: "canonical", href: "https://samura-auto.ru/privacy" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-32">
        <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-silver-dim transition-colors hover:text-blood">
          <ArrowLeft className="h-4 w-4" /> НА ГЛАВНУЮ
        </Link>
        <h1 className="mt-10 text-4xl font-light leading-tight md:text-5xl">
          Политика <span className="text-blood font-semibold">конфиденциальности</span>
        </h1>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-silver-dim">
          <section>
            <h2 className="text-lg font-medium text-foreground">1. Общие положения</h2>
            <p className="mt-3">
              Настоящая Политика конфиденциальности регулирует порядок обработки и защиты персональных данных
              пользователей сайта SAMURA AUTO (далее — «Сайт»). Используя Сайт, вы соглашаетесь с условиями
              настоящей Политики.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">2. Какие данные мы собираем</h2>
            <p className="mt-3">
              Мы собираем данные, которые вы предоставляете самостоятельно через формы на Сайте:
              имя, телефон, мессенджер, а также сведения о желаемом автомобиле. Дополнительно
              автоматически собираются технические данные: IP-адрес, тип браузера, страницы посещения,
              данные cookie.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">3. Цели обработки</h2>
            <p className="mt-3">
              Персональные данные используются для связи с вами, подбора автомобиля, заключения договора,
              предоставления услуг и информирования об их статусе. Технические данные — для аналитики и
              улучшения работы Сайта.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">4. Файлы cookie</h2>
            <p className="mt-3">
              Сайт использует файлы cookie для корректной работы интерфейса, сохранения пользовательских
              настроек и анализа посещаемости. Вы можете отключить cookie в настройках браузера, однако
              это может повлиять на работу отдельных функций Сайта.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">5. Передача данных третьим лицам</h2>
            <p className="mt-3">
              Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, прямо
              предусмотренных законодательством Российской Федерации, и случаев, необходимых для
              исполнения обязательств перед вами (например, передача данных перевозчику для доставки).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">6. Хранение и защита данных</h2>
            <p className="mt-3">
              Мы применяем организационные и технические меры для защиты данных от несанкционированного
              доступа, изменения, раскрытия или уничтожения. Данные хранятся в течение срока,
              необходимого для достижения целей обработки.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">7. Права пользователя</h2>
            <p className="mt-3">
              Вы вправе запросить информацию об обработке ваших данных, потребовать их уточнения,
              блокирования или удаления, направив запрос на контактные данные, указанные на Сайте.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">8. Изменения политики</h2>
            <p className="mt-3">
              Мы вправе обновлять настоящую Политику. Актуальная редакция всегда доступна на этой странице.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
