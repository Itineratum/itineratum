import { Button, Typography } from "@mui/material";
import constEndpoints from "@/constants/pages/endpoints.json";
import constTexts from "@/constants/pages/texts.json";
import Link from "next/link";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";

const ItineratumLogo = () => {
  return (
    <Link href={constEndpoints.home.link}>
      <Button
        key={constTexts.pageTitle}
        color='secondary'
      >
        <Text 
          text={constTexts.pageTitle}
          variant={TypographyVariant.h2}
          bold={true}
        />
      </Button>
    </Link>
  );
}

export default ItineratumLogo;
