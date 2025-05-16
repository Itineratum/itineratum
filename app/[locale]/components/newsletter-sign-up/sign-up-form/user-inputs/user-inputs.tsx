import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { HOME_STYLES } from "../../../styles";
import EmailTextInput from "./email-text-input";
import LetsGoButton from "./lets-go-button";
import NameTextInput from "./name-text-input";

const UserInputs = () => {
  const t = useTranslations("home.newsletterSignup");
  const styles = HOME_STYLES.NEWSLETTER_SIGNUP;

  return (
    <Stack
      direction="column"
      spacing={styles.SPACING}
      justifyContent={"center"}
    >
      <Box sx={{ display: "flex", textAlign: "center" }}>
        <Text text={t("header")} variant={TypographyVariant.h4} bold={false} />
      </Box>
      <NameTextInput />
      <EmailTextInput />
      <LetsGoButton />
    </Stack>
  );
};

export default UserInputs;
