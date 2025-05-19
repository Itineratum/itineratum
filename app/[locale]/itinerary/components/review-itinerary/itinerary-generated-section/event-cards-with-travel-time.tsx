import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Stack } from "@mui/material";
import { ITINERARY_STYLES } from "../../styles";
import TravelCard from "./travel-card";
import EventCard from "./event-card/event-card";
import noTravelTimes from "./no-travel-times";

const EventCardsWithTravelTime = () => {
  const { events, isEditing, travelTimes } = useReviewItinerary();

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY;

  return (
    <Stack
      direction="column"
      spacing={styles.ITINERARY_GENERATED_SECTION_SPACING}
    >
      {events.map((event, index) => (
        <Stack
          key={index}
          direction="column"
          spacing={styles.ITINERARY_GENERATED_SECTION_SPACING}
        >
          <EventCard event={event} index={index} />
          {!isEditing &&
            (travelTimes.length < 1
              ? noTravelTimes()
              : index < events.length - 1 &&
                travelTimes[index] && (
                  <TravelCard travelTime={travelTimes[index]} />
                ))}
        </Stack>
      ))}
    </Stack>
  );
};

export default EventCardsWithTravelTime;
