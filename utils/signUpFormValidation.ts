import { SetStateAction } from "react";

export const isValidEmail = (
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
