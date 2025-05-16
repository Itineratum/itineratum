import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep1 } from "@/hooks/useStep1";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { HOME_STYLES } from "../../../styles";

const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_1;

const handleOnFocus = (e: any) => {
  e.target.labels[0].style.overflow = "visible";
  e.target.labels[0].style.whiteSpace = "normal";
  e.target.labels[0].style.width = "100%";
};
const handleOnBlur = (e: any) => {
  e.target.labels[0].style.overflow =
    styles.LOCATION_FIELDS.INPUT_LABEL_PROPS.style.overflow;
  e.target.labels[0].style.textOverflow =
    styles.LOCATION_FIELDS.INPUT_LABEL_PROPS.style.textOverflow;
  e.target.labels[0].style.whiteSpace =
    styles.LOCATION_FIELDS.INPUT_LABEL_PROPS.style.whiteSpace;
  e.target.labels[0].style.width = styles.LOCATION_FIELDS.INPUT_LABEL_WIDTH;
};

const OriginField = ({}: {}) => {
  const { fields } = useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator.step1");

  return (
    <Box
      display="flex"
      sx={{
        width: "100%",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: { xs: "flex-start", md: "center" },
        gap: { xs: styles.MOBILE_SPACING, md: 0 },
      }}
    >
      <Box mr={styles.TEXT_LABEL_MARGIN_RIGHT}>
        <Text
          text={t("origin") + ":"}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Box>
      <Controller
        name={"originCountry"}
        control={fields.control}
        render={({ field }) => (
          <TextField
            {...fields.register("originCountry")}
            variant="outlined"
            label={t("originDescription")}
            fullWidth
            InputLabelProps={styles.LOCATION_FIELDS.INPUT_LABEL_PROPS}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

const DestinationField = ({}: {}) => {
  const { currentDestination, setCurrentDestination } = useStep1();

  const t = useTranslations("home.itineraryGenerator.step1");

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        width: "100%",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: { xs: "flex-start", md: "center" },
        gap: { xs: styles.MOBILE_SPACING, md: 0 },
      }}
    >
      <Box mr={styles.TEXT_LABEL_MARGIN_RIGHT}>
        <Text
          text={t("destinations") + ":"}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Box>
      <TextField
        variant="outlined"
        label={t("destinationsDescription")}
        fullWidth
        value={currentDestination}
        InputLabelProps={styles.LOCATION_FIELDS.INPUT_LABEL_PROPS}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={(e) => {
          setCurrentDestination(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export { DestinationField, OriginField };
