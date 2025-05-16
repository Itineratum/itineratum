import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";
import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

const NameTextInput = () => {
  const { control, errors, name } = useNewsletterSignup();

  const t = useTranslations("home.newsletterSignup");

  return (
    <Controller
      key={"name"}
      name={"name"}
      control={control}
      defaultValue=""
      rules={{
        required: t("nameRequired"),
      }}
      render={({ field }) => (
        <TextField
          {...field}
          required
          variant="filled"
          label={t("name")}
          value={name}
          InputLabelProps={{
            sx: { color: "text.primary" },
          }}
          error={!!errors.name}
          helperText={errors.name ? (errors.name.message as string) : ""}
        />
      )}
    />
  );
};

export default NameTextInput;
