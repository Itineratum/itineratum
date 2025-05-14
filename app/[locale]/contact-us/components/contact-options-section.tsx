import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import EmailBlock from "./contact-options-section/email-block";
import PhoneBlock from "./contact-options-section/phone-block";
import { CONTACT_US_STYLES } from "./styles";

const ContactOptionsSection = () => {
  const t = useTranslations("contactUs");
  const styles = CONTACT_US_STYLES;

  return (
    <Box
      sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      gap={styles.MARGIN}
    >
      <EmailBlock />
      <PhoneBlock />
    </Box>
  );
};

export default ContactOptionsSection;
