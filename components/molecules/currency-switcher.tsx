import { trpc } from "@/app/_trpc/client";
import { Currency, currencyMap } from "@/constants/enums/currency";
import { getCookie, setCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ButtonMenu from "./button-menu";
import { Skeleton } from "@mui/material";

const CurrencySwitcher = () => {
  const id: string = "currency-switcher";
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const email = session?.user.email!;
  const router = useRouter();

  const [currency, setCurrency] = useState<string>("");

  const switchCurrency = trpc.user.switchCurrency.useMutation();
  const getUserCurrencyLanguage = trpc.user.getUserCurrencyLanguage.useQuery(
    {
      email,
    },
    {
      enabled: isLoggedIn,
      retry: false,
      onError: (error) => {
        if (error.message === "UNAUTHORIZED") router.push("/protected");
      },
    },
  );

  const handleCurrencyChange = async (newCurrency: string) => {
    setCookie("currency", newCurrency);
    setCurrency(newCurrency);

    if (isLoggedIn) {
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
    if (getUserCurrencyLanguage.isFetched) {
      const userCurrency = getUserCurrencyLanguage.data?.currency;

      if (userCurrency) {
        setCurrency(userCurrency);
        setCookie("currency", userCurrency);
      }
    }
  }, [getUserCurrencyLanguage.isFetched]);

  const loadingIndicator = () => {
    return <Skeleton variant="rounded" height="100%" width="100%" />;
  };

  const switcher = () => {
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

  return isLoggedIn && getUserCurrencyLanguage.isLoading
    ? loadingIndicator()
    : switcher();
};

export default CurrencySwitcher;
