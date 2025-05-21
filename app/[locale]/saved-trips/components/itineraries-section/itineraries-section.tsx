import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../styles";
import ItineraryCard from "./itinerary-card";

const ItinerariesSection = () => {
  const { savedItineraries, isLoading, selectedItineraryId } = useSavedTrips();

  const t = useTranslations("savedTrips");
  const styles = SAVED_TRIPS_STYLES;

  const numOfItineraryCards = savedItineraries.length;

  return (
    <Grid
      item
      xs={12}
      md={styles.ITINERARIES_SECTION_GRID}
      sx={{ my: styles.SPACING }}
    >
      <Box
        sx={{
          border: styles.ITINERARIES_SECTION.BORDER,
          borderRadius: styles.ITINERARIES_SECTION.BORDER_RADIUS,
          padding: styles.ITINERARIES_SECTION.PADDING,
          paddingBottom: styles.ITINERARIES_SECTION.PADDING + 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Centers the ItineraryCards within the section
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress
              size={styles.ITINERARIES_SECTION.LOADING_ANIMATION_SIZE}
            />
          </Box>
        ) : savedItineraries.length === 0 ? (
          // no itineraries
          <Text
            text={t("noItineraries")}
            variant={TypographyVariant.h6}
            bold={false}
          />
        ) : (
          <Stack
            direction="column"
            spacing={styles.SPACING}
            alignItems="center"
          >
            {/* label */}
            <Text
              text={t("plannedTripsDescription") + ":"}
              variant={TypographyVariant.h6}
              bold={false}
            />
            <Box
              sx={{
                position: "relative",
                height:
                  styles.ITINERARIES_SECTION.ITINERARY_CARD.HEIGHT +
                  (numOfItineraryCards - 1) *
                    styles.ITINERARIES_SECTION.ITINERARY_CARD.OVERLAP_OFFSET,
                marginBottom: styles.MARGIN,
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Ensures cards are centered
              }}
            >
              {savedItineraries.map((record, index) => {
                const itineraryId = Object.keys(record)[0];
                const itinerary = record[itineraryId];

                return (
                  <ItineraryCard
                    key={itineraryId}
                    title={getItinerarySummaryText(itinerary)}
                    pictureUrl={itinerary.itinerary[0].events[0].photo}
                    itineraryId={itineraryId}
                    numOfCards={numOfItineraryCards}
                    index={index}
                    selected={selectedItineraryId === itineraryId}
                  />
                );
              })}
            </Box>
          </Stack>
        )}
      </Box>
    </Grid>
  );
};

export default ItinerariesSection;
