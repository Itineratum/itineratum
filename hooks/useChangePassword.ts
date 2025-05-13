import { ChangePasswordContext } from "@/contexts/changePasswordContext";
import { useContext } from "react";

export const useChangePassword = () => {
  const context = useContext(ChangePasswordContext);

  if (!context) {
    throw new Error(
      "useChangePassword must be used within a ChangePasswordProvider"
    );
  }

  return context;
};
