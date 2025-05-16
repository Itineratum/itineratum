import { NewsletterSignupContext } from "@/contexts/newsletterSignupContext";
import { useContext } from "react";

export const useNewsletterSignup = () => {
  const context = useContext(NewsletterSignupContext);

  if (!context) {
    throw new Error(
      "useNewsletterSignup must be used within an NewsletterSignupProvider"
    );
  }

  return context;
};
