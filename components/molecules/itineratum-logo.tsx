import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import constEndpoints from "@/constants/pages/endpoints.json";
import constTexts from "@/constants/pages/texts.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Button } from "@mui/material";
import { useLocale } from "next-intl";
import Link from "next/link";

const ItineratumLogo = ({}: {}) => {
  const locale = useLocale();

  return (
    <Link href={buildLocaleEndpoint(locale, constEndpoints.home.endpoint)}>
      <Button key={constEndpoints.home.name} sx={{ color: "text.primary" }}>
        <Text
          text={constTexts.pageTitle}
          variant={TypographyVariant.h2}
          bold={true}
        />
      </Button>
    </Link>
  );
};

export default ItineratumLogo;
