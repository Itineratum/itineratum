import constEndpoints from "@/constants/pages/endpoints.json";
import itineratumLogo from "@/public/logo.svg";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Button } from "@mui/material";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const ItineratumLogo = ({}: {}) => {
  const locale = useLocale();
  const logoHeight: string = "50px";

  return (
    <Link href={buildLocaleEndpoint(locale, constEndpoints.home.endpoint)}>
      <Button
        key={constEndpoints.home.name}
        sx={{
          color: "text.primary",
        }}
      >
        <Image
          src={itineratumLogo}
          alt={"Itineratum Logo"}
          style={{ height: logoHeight, width: "auto" }}
        />
      </Button>
    </Link>
  );
};

export default ItineratumLogo;
