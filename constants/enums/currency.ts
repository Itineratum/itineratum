export enum Currency {
  usd = "US$",
  eur = "€",
  jpy = "円",
  gbp = "£",
  cny = "元",
  aud = "A$",
  cad = "C$",
  chf = "CHF",
  hkd = "HK$",
  sgd = "S$",
}

const createCurrencyMap = (): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(Currency).map(([key]) => [key, key.toUpperCase()])
  );
};

export const currencyMap = createCurrencyMap();
