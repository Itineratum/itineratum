import {
  defaultFocusRankings,
  GenerateItineraryFocus,
} from "@/constants/enums/generateItinerary";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep3 } from "@/hooks/useStep3";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";

const ResetRankingsButton = () => {
  const { fields } = useItineraryGenerator();
  const { setFocusRankings, focusRankings } = useStep3();

  const t = useTranslations("home.itineraryGenerator.step3");

  const handleOnClick = () => {
    setFocusRankings(defaultFocusRankings);
    fields.setValue("focus", {
      attraction: 0,
      localCuisine: 0,
      nature: 0,
      shopping: 0,
    });
  };

  return (
    <Box flexShrink={0}>
      <Button
        onClick={handleOnClick}
        variant="contained"
        color="primary"
        startIcon={<RestartAltIcon />}
        disabled={
          Object.keys(focusRankings).every(
            (key) =>
              focusRankings[key as GenerateItineraryFocus] ===
              defaultFocusRankings[key as GenerateItineraryFocus]
          ) ||
          JSON.stringify(focusRankings) === JSON.stringify(defaultFocusRankings)
        }
      >
        {t("resetRankings")}
      </Button>
    </Box>
  );
};

export default ResetRankingsButton;
