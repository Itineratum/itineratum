"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

const Account = () => {
  const t = useTranslations();
  const { data: session } = useSession();
  const name: string = session?.user?.name!;
  const email: string = session?.user?.email!;
  const provider: string = session?.provider!;

  return (
    <div>
      <h1>Account</h1>
      <h2>{t("account.welcome", { name: name })}</h2>
      <h2>{`Email: ${email}`}</h2>
      <h2>{`Provider: ${provider}`}</h2>
    </div>
  );
};

export default Account;
