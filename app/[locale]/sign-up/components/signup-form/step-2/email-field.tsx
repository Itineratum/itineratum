import TextInputField from "@/components/molecules/text-input-field";
import { SignUpFormData } from "@/constants/types/formData/signUpFormData";
import { useSignup } from "@/hooks/useSignup";
import { isValidEmail } from "@/utils/signUpFormValidation";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";

const EmailField = () => {
  const { control, trigger, errors, email } = useSignup();

  const t = useTranslations("signUp.signUpForm");

  const emailValidation = (emailInput: string) => {
    const isValid = isValidEmail(emailInput);
    return isValid ? true : t("emailError");
  };

  const handleEmailChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<SignUpFormData, "email">
  ) => {
    field.onChange(event.target.value);
    await trigger("email");
  };

  return (
    <TextInputField
      name={"email"}
      label={t("email")}
      control={control}
      errorMessage={t("emailError")}
      errors={errors}
      value={email}
      validate={emailValidation}
      onChange={handleEmailChange}
    />
  );
};

export default EmailField;
