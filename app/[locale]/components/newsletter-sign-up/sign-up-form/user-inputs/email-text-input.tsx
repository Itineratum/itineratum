import { NewsletterFormData } from "@/constants/types/formData/newsletterFormData";
import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import { isValidEmail } from "@/utils/signUpFormValidation";
import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";

const EmailTextInput = () => {
  const { control, errors, trigger, email } = useNewsletterSignup();

  const t = useTranslations("home.newsletterSignup");

  const emailValidation = (emailInput: string) => {
    const isValid = isValidEmail(emailInput);
    return isValid ? true : t("emailError");
  };

  const handleEmailChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<NewsletterFormData, "email">,
  ) => {
    field.onChange(event.target.value);
    await trigger("email");
  };

  return (
    <Controller
      key={"email"}
      name={"email"}
      control={control}
      defaultValue=""
      rules={{
        validate: emailValidation,
        required: t("emailError"),
      }}
      render={({ field }) => (
        <TextField
          {...field}
          required
          variant="filled"
          label={t("email")}
          value={email}
          InputLabelProps={{
            sx: { color: "text.primary" },
          }}
          error={!!errors.email}
          helperText={errors.email ? (errors.email.message as string) : ""}
          onChange={async (event) => await handleEmailChange(event, field)}
        />
      )}
    />
  );
};

export default EmailTextInput;
