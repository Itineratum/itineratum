import { HOME_STYLES } from "@/app/[locale]/components/styles";
import Text from "@/components/atoms/text";
import { GenerateItineraryFocus } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { useStep3 } from "@/hooks/useStep3";
import { Box, MenuItem, Select, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import ResetRankingsButton from "./reset-rankings-button";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";

const FocusSection = () => {
  const { fields } = useItineraryGenerator();
  const { focusRankings, setFocusRankings, getFocusKey } = useStep3();

  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_3;
  const t = useTranslations("home.itineraryGenerator.step3");

  const rankValues = [1, 2, 3, 4];

  const handleRankChange = (focus: GenerateItineraryFocus, rank: number) => {
    setFocusRankings((prevRanks) => ({
      ...prevRanks,
      [focus]: rank,
    }));
    // @ts-ignore
    fields.setValue(`focus.${getFocusKey(focus)}`, rank);
  };

  const getAvailableRanks = (currentFocus: GenerateItineraryFocus) => {
    const selectedRanks = Object.values(focusRankings).filter(
      (focusRanking) =>
        focusRanking !== null && focusRanking !== focusRankings[currentFocus]
    );
    return rankValues.filter((rankValue) => !selectedRanks.includes(rankValue));
  };

  const selectRankHint = () => {
    return (
      <MenuItem value="" disabled>
        {t("selectRank")}
      </MenuItem>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row", gap: styles.SPACING + 70 },
        alignItems: "center",
      }}
    >
      <Stack spacing={styles.SPACING} direction="column">
        {Object.values(GenerateItineraryFocus).map((focus) => (
          <Box
            key={focus}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Select
              value={focusRankings[focus]}
              onChange={(event) =>
                handleRankChange(focus, event.target.value as number)
              }
              displayEmpty
              sx={{ minWidth: styles.FOCUS_SECTION_DROPDOWN_WIDTH }}
            >
              {selectRankHint()}
              {getAvailableRanks(focus).map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rank}
                </MenuItem>
              ))}
            </Select>
            <Box ml={styles.TEXT_LABEL_MARGIN_LEFT}>
              <Text text={focus} variant={TypographyVariant.h6} bold={false} />
            </Box>
          </Box>
        ))}
      </Stack>
      <ResetRankingsButton />
    </Box>
  );
};

export default FocusSection;
