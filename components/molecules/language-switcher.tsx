"use client";

import { Language } from "@/constants/enums/language";
import { usePathname, useRouter } from "@/navigation";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ButtonMenu from "./button-menu";

const LanguageSwitcher = ({ locale }: { locale: string }) => {
  const id: string = "language-switcher";
  const languages = Object(Language);
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLanguage: string) => {
    router.push(pathname, { locale: newLanguage });
  };

  return (
    <ButtonMenu
      id={id}
      text={locale.toUpperCase()}
      icon={<LanguageOutlinedIcon />}
      menuItems={languages}
      useLink={false}
      itemChangeHandler={handleLanguageChange}
    />
  );
};

export default LanguageSwitcher;
