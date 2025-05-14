import TextInputField from "@/components/molecules/text-input-field";
import { useLoginEmail } from "@/hooks/useLoginEmail";
import { useTranslations } from "next-intl";

const EmailField = () => {
  const { control, errors, email } = useLoginEmail();

  const t = useTranslations("login.loginForm");

  return (
    <TextInputField
      name={"email"}
      label={t("email")}
      control={control}
      errorMessage={t("emailError")}
      errors={errors}
      value={email}
    />
  );
};

export default EmailField;
