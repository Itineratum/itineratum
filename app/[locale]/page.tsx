import LanguageSwitcher from "@/components/molecules/language-switcher";
import constText from "@/constants/pages/texts.json";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: constText.pageTitle,
};

const Home = ({ params: { locale } }: { params: { locale: string } }) => {
  const t = useTranslations("home");

  return (
    <div>
      <h1>Home</h1>
      <h1>{t("header")}</h1>
      <LanguageSwitcher locale={locale} />
    </div>
  );
};

export default Home;
