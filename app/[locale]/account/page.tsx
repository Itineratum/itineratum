"use client"

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React from "react";

const Account = () => {
  const t = useTranslations();
  const {data: session} = useSession();
  const name: string = session?.user?.name!;
  const email: string = session?.user?.email!;

  console.log(`name: ${name}`);

  return (
    <div>
      <h1>Account</h1>
      <h2>{t("account.welcome", {name: name})}</h2>
      <h2>{`Email: ${email}`}</h2>
    </div>
  );
};

export default Account;
