import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { termsAndConditions } from "@/constants/pages/terms-and-conditions/termsAndConditions";
import { Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

const TermsAndConditions = () => {
  const t = useTranslations("termsAndConditions");

  const spacing = 4;

  return (
    <Container maxWidth="md">
      <Stack direction="column" spacing={spacing}>
        <Text
          text={t("termsAndConditions")}
          variant={TypographyVariant.h2}
          bold={true}
        />
        <Text
          text={termsAndConditions}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Stack>
    </Container>
  );
};

export default TermsAndConditions;
