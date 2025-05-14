import TextInputField from "@/components/molecules/text-input-field";
import { useLogin } from "@/hooks/useLogin";
import { useLoginEmail } from "@/hooks/useLoginEmail";
import { useTranslations } from "next-intl";

const PasswordField = () => {
  const { control, errors, password } = useLoginEmail();

  const t = useTranslations("login.loginForm");

  return (
    <TextInputField
      name={"password"}
      label={t("password")}
      control={control}
      errorMessage={t("passwordError")}
      errors={errors}
      value={password}
      isPasswordInputField={true}
    />
  );
};

export default PasswordField;
