"use client";

import { trpc } from "@/app/_trpc/client";
import { Language } from "@/constants/enums/language";
import { usePathname, useRouter } from "@/navigation";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ButtonMenu from "./button-menu";

const LanguageSwitcher = ({ locale }: { locale: string }) => {
  const id: string = "language-switcher";
  const languages = Object(Language);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const email = session?.user.email!;

  const [language, setLanguage] = useState<string>(locale.toUpperCase());

  const switchLangauge = trpc.user.switchLanguage.useMutation();
  const getUserCurrencyLanguage = trpc.user.getUserCurrencyLanguage.useQuery(
    {
      email,
    },
    {
      enabled: !!email,
      retry: false,
      onError: (error) => {
        if (error.message === "UNAUTHORIZED") router.push("/protected");
      },
    },
  );

  const handleLanguageChange = async (newLanguage: string) => {
    if (session?.user) {
      const data = { email, language: newLanguage };

      try {
        await switchLangauge.mutateAsync(data);
      } catch (error) {
        console.error(error);
      }
    }

    router.push(pathname, { locale: newLanguage });
  };

  useEffect(() => {
    const userLanguage = getUserCurrencyLanguage.data?.language;

    if (userLanguage) {
      setLanguage(userLanguage.toUpperCase());
      router.push(pathname, { locale: userLanguage });
    }
  }, [getUserCurrencyLanguage.data?.language]);

  return (
    <ButtonMenu
      id={id}
      text={language}
      icon={<LanguageOutlinedIcon />}
      menuItems={languages}
      useLink={false}
      itemChangeHandler={handleLanguageChange}
    />
  );
};

export default LanguageSwitcher;
