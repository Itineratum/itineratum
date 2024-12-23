import Text from "@/components/atoms/text";
import { GenerateItineraryFocus } from "@/constants/enums/generateItinerary";
import { TypographyVariant } from "@/constants/enums/theme";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button, Grid, MenuItem, Select, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

const Step3 = ({
  fields,
}: {
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const t = useTranslations("home.itineraryGenerator.step3");

  const defaultFocusRankings = {
    [GenerateItineraryFocus.attraction]: 0,
    [GenerateItineraryFocus.localCuisine]: 0,
    [GenerateItineraryFocus.nature]: 0,
    [GenerateItineraryFocus.shopping]: 0,
  };
  const [focusRankings, setFocusRankings] = useState<{
    [key in GenerateItineraryFocus]: number;
  }>(defaultFocusRankings);

  const spacing: number = 4;
  const textLabelMarginLeft: number = 2;

  const getFocusKey = (focus: GenerateItineraryFocus) => {
    return Object.entries(GenerateItineraryFocus).filter(
      (entry) => entry[1] === focus,
    )[0][0];
  };

  useEffect(() => {
    // synchronize focusRankings state with form values on initial load
    const initialFocusRankings = {
      [GenerateItineraryFocus.attraction]:
        fields.getValues("focus.attraction") || 0,
      [GenerateItineraryFocus.localCuisine]:
        fields.getValues("focus.localCuisine") || 0,
      [GenerateItineraryFocus.nature]: fields.getValues("focus.nature") || 0,
      [GenerateItineraryFocus.shopping]:
        fields.getValues("focus.shopping") || 0,
    };
    setFocusRankings(initialFocusRankings);
  }, [fields]);

  const labelAndHintSection = () => {
    const label = () => {
      return (
        <Text
          text={t("tripFocus") + "*: "}
          variant={TypographyVariant.h4}
          bold={true}
        />
      );
    };

    const hint = () => {
      return (
        <Text
          text={t("tripFocusHint")}
          variant={TypographyVariant.h6}
          bold={true}
        />
      );
    };

    return (
      <Grid item xs={6}>
        <Stack spacing={0} direction="column" alignItems="center">
          {label()}
          {hint()}
        </Stack>
      </Grid>
    );
  };

  const focusSection = () => {
    const rankValues = [1, 2, 3, 4];
    const dropdownWidth: string = "70px";

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
          focusRanking !== null && focusRanking !== focusRankings[currentFocus],
      );
      return rankValues.filter(
        (rankValue) => !selectedRanks.includes(rankValue),
      );
    };

    const selectRankHint = () => {
      return (
        <MenuItem value="" disabled>
          {t("selectRank")}
        </MenuItem>
      );
    };

    const resetRankingsButton = () => {
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
                  defaultFocusRankings[key as GenerateItineraryFocus],
              ) ||
              JSON.stringify(focusRankings) ===
                JSON.stringify(defaultFocusRankings)
            }
          >
            {t("resetRankings")}
          </Button>
        </Box>
      );
    };

    return (
      <Stack spacing={spacing + 10} direction="row" alignItems="center">
        <Stack spacing={spacing} direction="column">
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
                sx={{ minWidth: dropdownWidth }}
              >
                {selectRankHint()}
                {getAvailableRanks(focus).map((rank) => (
                  <MenuItem key={rank} value={rank}>
                    {rank}
                  </MenuItem>
                ))}
              </Select>
              <Box ml={textLabelMarginLeft}>
                <Text
                  text={focus}
                  variant={TypographyVariant.h6}
                  bold={false}
                />
              </Box>
            </Box>
          ))}
        </Stack>
        {resetRankingsButton()}
      </Stack>
    );
  };

  return (
    <Stack spacing={spacing} direction="column" alignItems="center">
      {labelAndHintSection()}
      {focusSection()}
    </Stack>
  );
};

export default Step3;
