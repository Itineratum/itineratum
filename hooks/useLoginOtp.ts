import { LoginOtpContext } from "@/contexts/loginOtpContext";
import { useContext } from "react";

export const useLoginOtp = () => {
  const context = useContext(LoginOtpContext);

  if (!context) {
    throw new Error("useLoginOtp must be used within an LoginOtpProvider");
  }

  return context;
};
