import endpointsConst from "@/constants/pages/endpoints.json";
import { useItinerary } from "@/hooks/useItinerary";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const { params } = useItinerary();
  const itineraryId = params.id;
  const locale = useLocale();
  const router = useRouter();

  const t = useTranslations("itinerary");

  const handleOnClick = () => {
    const returnUrl = `/${endpointsConst.itinerary.endpoint}/${itineraryId}?from=login`;
    const loginPath = buildLocaleEndpoint(
      locale,
      `${endpointsConst.login.endpoint}?returnUrl=${encodeURIComponent(returnUrl)}`
    );
    router.push(loginPath);
  };

  return (
    <Button variant="contained" onClick={handleOnClick}>
      {t("login")}
    </Button>
  );
};

export default LoginButton;
