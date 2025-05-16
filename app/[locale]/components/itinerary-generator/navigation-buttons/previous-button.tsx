import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const PreviousButton = () => {
  const { setDirection, setActiveStep, activeStep, generatingItinerary } =
    useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator");

  const handleOnClick = () => {
    setDirection("right");
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    activeStep > 0 && (
      <Button
        onClick={handleOnClick}
        variant="contained"
        color="primary"
        startIcon={<ArrowBackOutlinedIcon />}
        disabled={generatingItinerary}
      >
        {t("previous")}
      </Button>
    )
  );
};

export default PreviousButton;
