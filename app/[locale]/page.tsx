import constText from "@/constants/pages/texts.json";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: constText.pageTitle,
};

const Home = () => {
  const t = useTranslations("home");

  return (
    <div>
      <h1>Home</h1>
      <h1>{t("header")}</h1>
    </div>
  );
};

export default Home;
