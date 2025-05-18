import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";
import EventDetailsCard from "./event-details-card/event-details-card";

const DetailsSection = () => {
  const { events, setSelectedEvent, selectedEvent, setEventDetailsDialogOpen } =
    useReviewItinerary();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.DETAILS_SECTION;

  let numOfCards = events.length;

  return (
    <Stack direction="column" spacing={styles.SPACING}>
      {/* heading  */}
      <Text
        text={t("details") + "*"}
        variant={TypographyVariant.h5}
        bold={true}
        textDecoration={TypographyTextDecoration.underline}
      />
      <Box
        sx={{
          position: "relative",
          height:
            styles.EVENT_DETAILS_CARD.HEIGHT +
            (numOfCards - 1) * styles.EVENT_DETAILS_CARD.OVERLAP_OFFSET,
          marginBottom: styles.MARGIN,
        }}
      >
        {events.map((event, index) => {
          if (!event) return null;

          return (
            <EventDetailsCard
              key={index}
              event={event}
              index={index}
              numOfCards={numOfCards}
            />
          );
        })}
      </Box>
      {/* details section note */}
      <Box sx={{ marginTop: styles.MARGIN }}>
        <Text
          text={"*" + t("eventDetailsCard.details")}
          variant={TypographyVariant.body1}
          bold={true}
        />
      </Box>
    </Stack>
  );
};

export default DetailsSection;
