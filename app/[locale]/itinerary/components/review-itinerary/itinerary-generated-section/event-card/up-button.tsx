import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { IconButton } from "@mui/material";
import {
  ItineraryEditAction,
  ReorderEventInItineraryDetails,
} from "../../review-itinerary";

const UpButton = ({ index }: { index: number }) => {
  const { events, setShowSnackbar, setCurrentEdit } = useReviewItinerary();

  const handleOnClick = () => {
    if (index === 0) return; // cannot move up if already first

    const oldEventIndex = index;
    const newEventIndex = index - 1;
    const movedEvent = events[oldEventIndex];

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
    index > 0 && (
      <IconButton onClick={handleOnClick}>
        <ArrowUpwardOutlinedIcon />
      </IconButton>
    )
  );
};

export default UpButton;
