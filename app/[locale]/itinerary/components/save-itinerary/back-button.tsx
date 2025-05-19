import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { useItinerary } from "@/hooks/useItinerary";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

const BackButton = () => {
  const { setItineraryPageStep } = useItinerary();

  const handleOnClick = () => {
    setItineraryPageStep(ItineraryPageStep.reviewItinerary);
  };

  return (
    <IconButton onClick={handleOnClick} color="inherit">
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
