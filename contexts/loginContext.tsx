"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type LoginContextType = {
  isLoginUsingOtp: boolean;
  setIsLoginUsingOtp: Dispatch<SetStateAction<boolean>>;
  returnUrl: string | null;
  setReturnUrl: Dispatch<SetStateAction<string | null>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  isLoggingIn: boolean;
  setIsLoggingIn: Dispatch<SetStateAction<boolean>>;
};

export const LoginContext = createContext<LoginContextType | undefined>(
  undefined,
);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginUsingOtp, setIsLoginUsingOtp] = useState<boolean>(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setReturnUrl(searchParams.get("returnUrl"));
  }, []);

  return (
    <LoginContext.Provider
      value={{
        isLoginUsingOtp,
        setIsLoginUsingOtp,
        returnUrl,
        setReturnUrl,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        isLoggingIn,
        setIsLoggingIn,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
