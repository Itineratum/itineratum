import { Currency, currencyMap } from "@/constants/enums/currency";
import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import ButtonMenu from "./button-menu";

const CurrencySwitcher = () => {
  const id: string = "currency-switcher";
  const [currency, setCurrency] = useState<string>(Currency.sgd);

  const handleCurrencyChange = (newCurrency: string) => {
    setCookie("currency", newCurrency);
    setCurrency(newCurrency);
  };

  useEffect(() => {
    const storedCurrency = getCookie("currency");
    if (storedCurrency && typeof storedCurrency === "string") {
      setCurrency(storedCurrency);
    }
  }, []);

  return (
    <ButtonMenu
      id={id}
      text={currency.toUpperCase()}
      menuValues={currencyMap}
      itemChangeHandler={handleCurrencyChange}
    />
  );
};

export default CurrencySwitcher;
