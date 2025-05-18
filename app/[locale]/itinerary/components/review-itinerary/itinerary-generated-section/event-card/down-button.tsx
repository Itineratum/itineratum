import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { IconButton } from "@mui/material";
import {
  ItineraryEditAction,
  ReorderEventInItineraryDetails,
} from "../../review-itinerary";

const DownButton = ({ index }: { index: number }) => {
  const { events, setShowSnackbar, setCurrentEdit } = useReviewItinerary();

  const handleOnClick = () => {
    if (index === events.length - 1) return; // cannot move down if already last

    const oldEventIndex = index;
    const newEventIndex = index + 1;
    const movedEvent = events[oldEventIndex];

    // Check time-of-day constraint
    if (movedEvent.time_of_day !== events[newEventIndex].time_of_day) {
      setShowSnackbar(true);
      return;
    }

    const newEdit: Partial<
      Record<ItineraryEditAction, ReorderEventInItineraryDetails>
    > = {
      [ItineraryEditAction.reorder]: {
        event: movedEvent,
        oldEventIndex,
        newEventIndex,
      },
    };
    setCurrentEdit(newEdit);
  };

  return (
    index < events.length - 1 && (
      <IconButton onClick={handleOnClick}>
        <ArrowDownwardOutlinedIcon />
      </IconButton>
    )
  );
};

export default DownButton;
