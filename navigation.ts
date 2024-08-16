import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { Language } from "./constants/enums/language";

export const locales = Object.keys(Language);
export const localePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
