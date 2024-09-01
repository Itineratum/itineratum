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
export const Country: CountryCode[] = [];

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
    Country.push(countryIso2);
  } catch (error) {
    // there will be some country call codes whose countryIso2 will be unable to retrieve via getCountryCallingCode(countryIso2)
    // this is due to slight differences in the list of countries available in countries-list and libphonenumber-js
  }
});
