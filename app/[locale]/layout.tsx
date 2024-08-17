import Navbar from "@/components/organisms/navbar";
import SessionProvider from "@/components/SessionProvider";
import { locales } from "@/navigation";
import theme from "@/styles/theme";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { use } from "react";

const HomeLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  const messages = useMessages();
  const session = use(getServerSession());

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <SessionProvider session={session}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <body>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <Navbar locale={locale} />
                {children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </body>
        </NextIntlClientProvider>
      </SessionProvider>
    </html>
  );
};

export default HomeLayout;
