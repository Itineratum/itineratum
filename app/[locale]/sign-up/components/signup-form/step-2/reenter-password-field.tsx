import TextInputField from "@/components/molecules/text-input-field";
import { SignUpFormData } from "@/constants/types/formData/signUpFormData";
import { useSignup } from "@/hooks/useSignup";
import { isValidPassword } from "@/utils/signUpFormValidation";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";

const ReEnterPasswordField = () => {
  const { control, errors, reEnterPassword, password, trigger } = useSignup();

  const t = useTranslations("signUp.signUpForm");

  const reEnterPasswordValidation = (reEnterPasswordInput: string) => {
    const isValid =
      reEnterPasswordInput === password &&
      isValidPassword(reEnterPasswordInput);
    return isValid ? true : t("reEnterPasswordError");
  };

  const handleReEnterPasswordChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<SignUpFormData, "reEnterPassword">,
  ) => {
    field.onChange(event.target.value);
    await trigger("reEnterPassword");
  };

  return (
    <TextInputField
      name={"reEnterPassword"}
      label={t("reEnterPassword")}
      control={control}
      errorMessage={t("reEnterPasswordError")}
      errors={errors}
      value={reEnterPassword}
      validate={reEnterPasswordValidation}
      isPasswordInputField={true}
      onChange={handleReEnterPasswordChange}
    />
  );
};

export default ReEnterPasswordField;
