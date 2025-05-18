import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { default as endpointsConst } from "@/constants/pages/endpoints.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ITINERARY_STYLES } from "../styles";

const BackButton = () => {
  const { canGoBack } = useReviewItinerary();
  const router = useRouter();
  const locale = useLocale();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY;

  const handleOnClick = () => {
    router.push(
      buildLocaleEndpoint(locale, endpointsConst.savedTrips.endpoint),
    );
  };
  return (
    canGoBack && (
      <Stack
        direction="row"
        spacing={styles.BACK_BUTTON_SPACING}
        alignItems="center"
      >
        <IconButton onClick={handleOnClick} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Text text={t("back")} variant={TypographyVariant.h6} bold={false} />
      </Stack>
    )
  );
};

export default BackButton;
