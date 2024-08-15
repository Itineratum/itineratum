import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import constEndpoints from "@/constants/pages/endpoints.json";
import constTexts from "@/constants/pages/texts.json";
import { Button } from "@mui/material";
import Link from "next/link";

const ItineratumLogo = () => {
  return (
    <Link href={constEndpoints.home.link}>
      <Button key={constEndpoints.home.name} color="secondary">
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
