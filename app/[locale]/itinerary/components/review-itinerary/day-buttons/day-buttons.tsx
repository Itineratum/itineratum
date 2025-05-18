import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Stack } from "@mui/material";
import { ITINERARY_STYLES } from "../../styles";
import DayButton from "./day-button";

const DayButtons = () => {
  const { itineraryData, dayNum } = useReviewItinerary();

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY;

  return (
    itineraryData && (
      <Stack
        direction="row"
        spacing={styles.DAY_BUTTONS_SPACING}
        sx={{ overflow: "auto", maxWidth: "100%" }}
      >
        {Array(itineraryData.itinerary.length)
          .fill(0)
          .map((_, index) => (
            <DayButton
              key={index}
              selected={index + 1 === dayNum}
              dayNum={index + 1}
            />
          ))}
      </Stack>
    )
  );
};

export default DayButtons;
