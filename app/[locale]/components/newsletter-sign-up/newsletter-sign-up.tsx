"use client";

import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import { Skeleton } from "@mui/material";
import SignUpForm from "./sign-up-form/sign-up-form";

const NewsletterSignup = () => {
  const { isLoggedIn, checkEmailInNewsletter, hasEmailInNewsletter } =
    useNewsletterSignup();

  return isLoggedIn && checkEmailInNewsletter.isLoading ? (
    // loading indicator
    <Skeleton variant="rounded" height="100%" width="100%" />
  ) : hasEmailInNewsletter ? (
    <div></div>
  ) : (
    <SignUpForm />
  );
};

export default NewsletterSignup;
