import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event } from "@/lib/pythonBackend/types";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { ITINERARY_STYLES } from "../../../styles";

const EventDetails = ({
  event,
  color,
  date,
}: {
  event: Event;
  color: string;
  date: dayjs.Dayjs;
}) => {
  const { dayPlan } = useReviewItinerary();

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_CARD;

  const timeOfDay = event.time_of_day;

  const timeSection = () => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        textAlign="left"
        spacing={styles.SPACING}
      >
        <CalendarTodayIcon
          sx={{ color, width: styles.ICON_SIZE, height: styles.ICON_SIZE }}
        />
        <Text
          text={`${date.format("DD MMM YYYY")}\n${timeOfDay}`}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Stack>
    );
  };

  const locationSection = () => {
    const spacing: number = 2;

    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={spacing}
        textAlign="left"
      >
        <LocationOnIcon
          sx={{ color, width: styles.ICON_SIZE, height: styles.ICON_SIZE }}
        />
        <Text
          text={`${event.event_name}, ${dayPlan?.destination}`}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Stack>
    );
  };

  return (
    <Stack direction="column" spacing={styles.SPACING}>
      {timeSection()}
      {locationSection()}
    </Stack>
  );
};

export default EventDetails;
