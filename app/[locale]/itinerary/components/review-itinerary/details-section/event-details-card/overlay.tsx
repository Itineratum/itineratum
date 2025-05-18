import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event } from "@/lib/pythonBackend/types";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../styles";

const Overlay = ({ event }: { event: Event }) => {
  const { setEventDetailsDialogOpen } = useReviewItinerary();

  const t = useTranslations("itinerary.eventDetailsCard");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.DETAILS_SECTION.EVENT_DETAILS_CARD;

  const handleOnClick = () => {
    setEventDetailsDialogOpen(true);
  };

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: styles.BORDER_RADIUS,
        border: "2px solid black",
        padding: "8px 16px",
        textAlign: "center",
        minWidth: styles.OVERLAY_WIDTH,
        maxWidth: styles.OVERLAY_WIDTH,
      }}
    >
      {/* event label */}
      <Box
        sx={{
          display: "-webkit-box", // Ensures multi-line ellipsis
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          WebkitLineClamp: 2, // Limits text to 2 lines
          textOverflow: "ellipsis",
        }}
      >
        <Text
          text={event.event_name.toUpperCase()}
          variant={TypographyVariant.h3}
          bold={false}
        />
      </Box>
      {/* learn more button  */}
      <Button onClick={handleOnClick} variant="text">
        <Text
          text={t("learnMore").toUpperCase()}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
          textDecoration={TypographyTextDecoration.underline}
        />
      </Button>
    </Box>
  );
};

export default Overlay;
