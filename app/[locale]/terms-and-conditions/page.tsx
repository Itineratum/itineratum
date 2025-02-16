import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { termsAndConditions } from "@/constants/pages/terms-and-conditions/termsAndConditions";
import { Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

const TermsAndConditions = () => {
  const t = useTranslations("termsAndConditions");

  const spacing = 4;

  const termsAndConditionsText = () => {
    return (
      <Text
        text={t("termsAndConditions")}
        variant={TypographyVariant.h2}
        bold={true}
      />
    );
  };

  const termsAndConditionsBody = () => {
    return (
      <Text
        text={termsAndConditions}
        variant={TypographyVariant.h6}
        bold={false}
      />
    );
  };

  return (
    <Container maxWidth="md">
      <Stack direction="column" spacing={spacing}>
        {termsAndConditionsText()}
        {termsAndConditionsBody()}
      </Stack>
    </Container>
  );
};

export default TermsAndConditions;
