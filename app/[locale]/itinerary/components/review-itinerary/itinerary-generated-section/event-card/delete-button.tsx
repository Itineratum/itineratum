import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event } from "@/lib/pythonBackend/types";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { IconButton } from "@mui/material";
import { ITINERARY_STYLES } from "../../../styles";
import {
  DeleteEventFromItineraryDetails,
  ItineraryEditAction,
} from "../../review-itinerary";

const DeleteButton = ({ index, event }: { index: number; event: Event }) => {
  const { setCurrentEdit } = useReviewItinerary();

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_CARD;

  const handleOnClick = () => {
    const newEdit: Partial<
      Record<ItineraryEditAction, DeleteEventFromItineraryDetails>
    > = {
      [ItineraryEditAction.delete]: {
        indexToDeleteEventFrom: index,
        event,
      },
    };
    setCurrentEdit(newEdit);
  };

  return (
    <IconButton
      onClick={handleOnClick}
      sx={{
        position: "absolute",
        top: -16,
        left: { xs: 36, md: -16 },
        zIndex: 1,
        backgroundColor:
          colorsConst.components.eventCard.deleteButtonBackground,
        "&:hover": {
          backgroundColor:
            colorsConst.components.eventCard.deleteButtonBackgroundHover,
        },
      }}
    >
      <RemoveCircleIcon
        sx={{
          color: colorsConst.components.eventCard.deleteButton,
          height: styles.ICON_SIZE,
          width: styles.ICON_SIZE,
        }}
      />
    </IconButton>
  );
};

export default DeleteButton;
