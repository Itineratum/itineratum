import Navbar from "@/components/organisms/navbar";
import { locales } from "@/navigation";
import theme from "@/styles/theme";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";

const HomeLayout = ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = useMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <Navbar />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
};

export default HomeLayout;
