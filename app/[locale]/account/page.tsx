import { getServerSession } from "next-auth";
import { useTranslations } from "next-intl";
import { use } from "react";

const Account = () => {
  const t = useTranslations();
  const session = use(getServerSession());
  const name: string = session?.user?.name!;
  const email: string = session?.user?.email!;

  return (
    <div>
      <h1>Account</h1>
      <h2>{t("account.welcome", { name: name })}</h2>
      <h2>{`Email: ${email}`}</h2>
    </div>
  );
};

export default Account;
