import { getCountryDataList, getEmojiFlag } from "countries-list";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";

interface CountryInfo {
  name: string;
  callingCode: string;
  flagEmoji: string;
  iso2: CountryCode;
}

const countryDataList = getCountryDataList().sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const countryInfoList: Record<CountryCode, CountryInfo> = {} as Record<
  CountryCode,
  CountryInfo
>;
const countryList: string[] = [];

countryDataList.map((country) => {
  const countryIso2 = country.iso2 as CountryCode;

  try {
    const callingCode = `+${getCountryCallingCode(countryIso2)}`;
    const flagEmoji = getEmojiFlag(country.iso2);

    countryInfoList[countryIso2] = {
      name: country.name,
      callingCode,
      flagEmoji,
      iso2: countryIso2,
    };
    countryList.push(country.name);
  } catch (error) {}
});

export const Country = countryList.reduce(
  (acc, country) => {
    acc[country] = country;
    return acc;
  },
  {} as Record<string, string>,
);
