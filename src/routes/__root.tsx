import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SAMURA AUTO — импорт автомобилей из Японии, Кореи и Китая" },
      { name: "description", content: "SAMURA AUTO — подбор и доставка автомобилей из Японии, Кореи и Китая под ключ. Каталог проверенных авто, прозрачная цена, полное сопровождение сделки." },
      { name: "author", content: "SAMURA AUTO" },
      { name: "yandex-verification", content: "b341aaf75ac1d0a0" },
      { name: "google-site-verification", content: "izdKR8VBty0nMwqvN5n5RXnWZ4eTRgfhPTeO_c3GjKQ" },
      { property: "og:title", content: "SAMURA AUTO — импорт автомобилей из Японии, Кореи и Китая" },
      { property: "og:description", content: "Подбор и доставка автомобилей из-за рубежа под ключ. Каталог проверенных авто и полное сопровождение сделки." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SAMURA AUTO — импорт автомобилей" },
      { name: "twitter:description", content: "Подбор и доставка автомобилей из Японии, Кореи и Китая под ключ." },
      { property: "og:image", content: "https://samura-auto.ru/og-cover.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://samura-auto.ru/og-cover.jpg" },
      { name: "theme-color", content: "#0a0a0a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon-512x512.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://mc.yandex.ru", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://zduftrhicuyyfjzbfjbi.supabase.co", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://mc.yandex.ru" },
    ],
    scripts: [
      {
        children: `(function(){function load(){if(window.__ymLoaded)return;window.__ymLoaded=true;(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=109953130','ym');ym(109953130,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});}function schedule(){if('requestIdleCallback' in window){requestIdleCallback(load,{timeout:3000});}else{setTimeout(load,1500);}}if(document.readyState==='complete'){schedule();}else{window.addEventListener('load',schedule,{once:true});}})();`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SAMURA AUTO",
          url: "https://samura-auto.ru",
          logo: "https://samura-auto.ru/logo.png",
          description: "Импорт и подбор автомобилей под заказ из Японии, Кореи, Китая, Европы и США.",
          telephone: "+7 950 090 17 56",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Иркутск",
            addressCountry: "RU",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "SAMURA AUTO",
          url: "https://samura-auto.ru",
          inLanguage: "ru-RU",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
