import TextInputField from "@/components/molecules/text-input-field";
import { SignUpFormData } from "@/constants/types/formData/signUpFormData";
import { useSignup } from "@/hooks/useSignup";
import { isValidPassword } from "@/utils/signUpFormValidation";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";

const PasswordField = () => {
  const { control, trigger, password, errors, reEnterPassword } = useSignup();

  const t = useTranslations("signUp.signUpForm");

  const passwordValidation = (passwordInput: string) => {
    const isValid = isValidPassword(passwordInput);
    return isValid ? true : t("passwordError");
  };

  const handlePasswordChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<SignUpFormData, "password">,
  ) => {
    field.onChange(event.target.value);
    await trigger("password");

    if (reEnterPassword) await trigger("reEnterPassword");
  };

  return (
    <TextInputField
      name={"password"}
      label={t("password")}
      control={control}
      errorMessage={t("passwordError")}
      errors={errors}
      value={password}
      validate={passwordValidation}
      isPasswordInputField={true}
      onChange={handlePasswordChange}
    />
  );
};

export default PasswordField;
