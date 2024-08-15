import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const languages = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  ja: "日本語",
  ko: "한국인",
  ms: "Melayu",
  ta: "தமிழ்",
  zh: "中文",
};

export const locales = Object.keys(languages);
export const localePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
