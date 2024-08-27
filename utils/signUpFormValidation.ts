import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { SetStateAction } from "react";

export const validatePhoneNumber = (
  number: string,
  countryIso2: CountryCode,
  setPhoneNumberError: (value: SetStateAction<boolean>) => void,
  setPhoneNumberHelperText: (value: SetStateAction<string>) => void,
  phoneNumberHelperText: string,
) => {
  const onError = () => {
    setPhoneNumberError(true);
    setPhoneNumberHelperText(phoneNumberHelperText);
  };

  try {
    if (!isValidPhoneNumber(number, countryIso2)) {
      onError();
    } else {
      setPhoneNumberError(false);
      setPhoneNumberHelperText("");
    }
  } catch (error) {
    onError();
  }
};

export const validateEmail = (
  email: string,
  setEmailError: (value: SetStateAction<boolean>) => void,
  setEmailHelperText: (value: SetStateAction<string>) => void,
  emailHelperText: string,
) => {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValidEmail: boolean = regex.test(email);

  const onError = () => {
    setEmailError(true);
    setEmailHelperText(emailHelperText);
  };

  try {
    if (isValidEmail) {
      setEmailError(false);
      setEmailHelperText("");
    } else {
      onError();
    }
  } catch (error) {
    onError();
  }
};
