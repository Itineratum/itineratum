import { trpc } from "@/app/_trpc/client";
import { Currency, currencyMap } from "@/constants/enums/currency";
import { getCookie, setCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ButtonMenu from "./button-menu";

const CurrencySwitcher = () => {
  const id: string = "currency-switcher";
  const { data: session } = useSession();
  const email = session?.user.email!;
  const router = useRouter();

  const [currency, setCurrency] = useState<string>(Currency.sgd);

  const switchCurrency = trpc.user.switchCurrency.useMutation();
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

  const handleCurrencyChange = async (newCurrency: string) => {
    setCookie("currency", newCurrency);
    setCurrency(newCurrency);

    if (session?.user) {
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
  }, []);

  useEffect(() => {
    const userCurrency = getUserCurrencyLanguage.data?.currency;

    if (userCurrency) {
      setCurrency(userCurrency);
      setCookie("currency", userCurrency);
    }
  }, [getUserCurrencyLanguage.data?.currency]);

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
