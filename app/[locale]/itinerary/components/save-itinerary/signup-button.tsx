import endpointsConst from "@/constants/pages/endpoints.json";
import { useItinerary } from "@/hooks/useItinerary";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const SignupButton = () => {
  const { params } = useItinerary();
  const itineraryId = params.id;
  const locale = useLocale();
  const router = useRouter();

  const t = useTranslations("itinerary");

  const handleOnClick = () => {
    const returnUrl = `/${endpointsConst.itinerary.endpoint}/${itineraryId}?from=signup`;
    const signupPath = buildLocaleEndpoint(
      locale,
      `${endpointsConst.signUp.endpoint}?returnUrl=${encodeURIComponent(returnUrl)}`
    );
    router.push(signupPath);
  };

  return (
    <Button variant="outlined" onClick={handleOnClick}>
      {t("signUp")}
    </Button>
  );
};

export default SignupButton;
