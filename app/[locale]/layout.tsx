import SessionProvider from "@/app/providers/SessionProvider";
import Footer from "@/components/organisms/footer";
import Navbar from "@/components/organisms/navbar";
import { locales } from "@/navigation";
import theme from "@/styles/theme";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "@uploadthing/react/styles.css";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { use } from "react";
import TRPCProvider from "../_trpc/Provider";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ItineraryProvider } from "@/contexts/itineraryContext";

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
          <AppRouterCacheProvider>
            <body style={{ margin: 0, padding: 0 }}>
              <ThemeProvider theme={theme}>
                <TRPCProvider>
                  <Navbar />
                  <main>
                    <ItineraryProvider>{children}</ItineraryProvider>
                  </main>
                  <Footer />
                </TRPCProvider>
              </ThemeProvider>
            </body>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
      </SessionProvider>
    </html>
  );
};

export default HomeLayout;
