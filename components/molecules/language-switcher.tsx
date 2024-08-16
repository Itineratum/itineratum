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
  
  const handleLanguageChange = (language: string) => {
    router.push(pathname, { locale: language });
  };

  return (
    <ButtonMenu
      id={id}
      text={locale.toUpperCase()}
      icon={<LanguageOutlinedIcon />}
      menuValues={languages}
      itemChangeHandler={handleLanguageChange}
    />
  );
};

export default LanguageSwitcher;
