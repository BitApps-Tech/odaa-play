import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  Navigate,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { AadaaWidget } from "@/components/gadaa/AadaaAI";
import { Header } from "@/components/gadaa/Header";
import { OdaaLogo } from "@/components/gadaa/OdaaLogo";
import { AUTH_EVENT, readBrowserSessionPhone } from "@/lib/auth";
import { LanguageProvider, useI18n } from "@/lib/i18n";
import { THEME_BOOTSTRAP, ThemeProvider } from "@/lib/theme";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t.common.pageNotFound}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.common.pageNotFoundBody}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.common.goHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useI18n();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t.common.pageFailed}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.common.pageFailedBody}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.common.tryAgain}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t.common.goHome}
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
      { title: "Odaa Play" },
      { name: "description", content: "Oromia cultural, language and tourism game" },
      { name: "author", content: "Oromia Culture and Tourism Bureau" },
      { property: "og:title", content: "Odaa Play" },
      { property: "og:description", content: "Explore Oromia. Level up." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/odaa-play-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/odaa-play-logo.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico?v=odaa", sizes: "32x32", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.png?v=odaa", sizes: "32x32", type: "image/png" },
      { rel: "icon", href: "/favicon-48.png?v=odaa", sizes: "48x48", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=odaa", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <HeadContent />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <Scripts />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

function AuthSplash() {
  const { t } = useI18n();
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <OdaaLogo className="mx-auto h-36 w-32" />
        <p className="mt-4 text-sm text-muted-foreground">{t.brand.opening}</p>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/login";
  const [sessionPhone, setSessionPhone] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const sync = () => setSessionPhone(readBrowserSessionPhone());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    return () => window.removeEventListener(AUTH_EVENT, sync);
  }, [pathname]);

  let content: ReactNode;
  if (isLogin) {
    content = sessionPhone ? <Navigate to="/quests" search={{}} replace /> : <Outlet />;
  } else if (sessionPhone === undefined) {
    content = <AuthSplash />;
  } else if (sessionPhone) {
    content = (
      <>
        <Header />
        <Outlet />
        <AadaaWidget />
      </>
    );
  } else {
    content = <Navigate to="/login" replace />;
  }

  return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>;
}
