import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { ITINERARY_STYLES } from "../../../styles";

const ModifyButton = ({ index }: { index: number }) => {
  const { setIndexToModifyEventAt, setModifyEventDialogOpen } =
    useReviewItinerary();

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_CARD;

  const handleOnClick = () => {
    setIndexToModifyEventAt(index);
    setModifyEventDialogOpen(true);
  };

  return (
    <IconButton
      onClick={handleOnClick}
      sx={{
        position: "absolute",
        top: -16,
        right: -16,
        zIndex: 1,
        backgroundColor: colorsConst.palette.text.secondary,
        "&:hover": {
          backgroundColor: colorsConst.palette.text.grey,
        },
      }}
    >
      <EditIcon
        sx={{
          color: colorsConst.palette.text.primary,
          height: styles.ICON_SIZE,
          width: styles.ICON_SIZE,
        }}
      />
    </IconButton>
  );
};

export default ModifyButton;
