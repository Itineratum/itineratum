import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSaveItinerary } from "@/hooks/useSaveItinerary";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../styles";

const EmailField = () => {
  const { control, errors, email } = useSaveItinerary();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.SAVE_ITINERARY;

  return (
    <Stack
      direction="column"
      spacing={styles.FIELD_SPACING}
      display="flex"
      alignItems="center"
      width="100%"
    >
      <Text
        text={t("emailInstructions")}
        variant={TypographyVariant.h6}
        bold={false}
      />
      <Box width="75%">
        <TextInputField
          name={"email"}
          label={t("email")}
          control={control}
          errorMessage={t("emailError")}
          errors={errors}
          value={email}
          isPasswordInputField={false}
        />
      </Box>
    </Stack>
  );
};

export default EmailField;
