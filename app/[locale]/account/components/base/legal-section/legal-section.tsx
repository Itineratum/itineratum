import { Stack } from "@mui/material";
import { ACCOUNT_BASE_STYLES } from "../styles";
import Header from "./header";
import TermsAndConditions from "./terms-and-conditions";
import PrivacyPolicy from "./privacy-policy";

const LegalSection = () => {
  const style = ACCOUNT_BASE_STYLES;

  return (
    <Stack
      spacing={style.SPACING}
      sx={{
        textAlign: "center",
        marginTop: style.SECTION_MARTGIN,
      }}
    >
      <Header />
      <TermsAndConditions />
      <PrivacyPolicy />
    </Stack>
  );
};

export default LegalSection;
