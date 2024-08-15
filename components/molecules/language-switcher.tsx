"use client";

import { useRouter, usePathname, languages } from "@/navigation";

const LanguageSwitcher = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: { target: { value: any } }) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <select value={locale} onChange={handleChange}>
      {Object.keys(languages).map((language) => (
        <option key={language} value={language}>
          {/* @ts-expect-error */}
          {languages[language]}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
