import { trpc } from "@/app/_trpc/client";
import { Currency, currencyMap } from "@/constants/enums/currency";
import { getCookie, setCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ButtonMenu from "./button-menu";

const CurrencySwitcher = () => {
  const id: string = "currency-switcher";
  const [currency, setCurrency] = useState<string>(Currency.sgd);
  const { data: session } = useSession();

  const switchCurrency = trpc.user.switchCurrency.useMutation();

  const handleCurrencyChange = async (newCurrency: string) => {
    setCookie("currency", newCurrency);
    setCurrency(newCurrency);

    if (session?.user) {
      const email = session.user.email!;
      const data = { email, currency: newCurrency };

      try {
        await switchCurrency.mutateAsync(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const storedCurrency = getCookie("currency");
    if (storedCurrency && typeof storedCurrency === "string") {
      setCurrency(storedCurrency);
    }
    // TODO: retrieve currency from user document in MongoDB
  }, []);

  return (
    <ButtonMenu
      id={id}
      text={currency.toUpperCase()}
      menuItems={currencyMap}
      useLink={false}
      itemChangeHandler={handleCurrencyChange}
    />
  );
};

export default CurrencySwitcher;
