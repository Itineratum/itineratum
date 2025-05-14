import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import { Box } from "@mui/material";
import CountryField from "./country-field";
import NextButton from "./next-button";
import PhoneNumberSection from "./phone-number-section/phone-number-section";

const Step1 = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CountryField />
      <PhoneNumberSection />
      <PrivacyPolicyLink />
      <NextButton />
    </Box>
  );
};

export default Step1;
