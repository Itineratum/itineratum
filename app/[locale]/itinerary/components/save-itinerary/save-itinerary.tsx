import { OrDivider } from "@/components/atoms/or-divider";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../styles";
import BackButton from "./back-button";
import EmailField from "./email-field";
import LoginButton from "./login-button";
import ProceedButton from "./proceed-button";
import SignupButton from "./signup-button";

const SaveItinerary = ({}: {}) => {
  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.SAVE_ITINERARY;

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "fit-content",
      }}
    >
      <Stack
        direction="column"
        spacing={styles.SPACING}
        display="flex"
        alignItems="flex-start"
      >
        <Stack
          direction="column"
          spacing={styles.SPACING / 2}
          display="flex"
          alignItems="flex-start"
        >
          <BackButton />
          {/* instructions */}
          <Text
            text={t("saveItineraryInstructions") + ":"}
            variant={TypographyVariant.h5}
            bold={true}
          />
        </Stack>
        {/* login signup buttons */}
        <Stack
          direction="row"
          spacing={styles.SPACING}
          display="flex"
          justifyContent="center"
          width="100%"
        >
          <LoginButton />
          <SignupButton />
        </Stack>
        <OrDivider formMargin={0} />
        <EmailField />
        <ProceedButton />
      </Stack>
    </Container>
  );
};

export default SaveItinerary;
