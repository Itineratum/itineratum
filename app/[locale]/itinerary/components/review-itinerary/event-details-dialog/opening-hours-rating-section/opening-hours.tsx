import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../styles";

const OpeningHours = () => {
  const { selectedEvent } = useReviewItinerary();
  const event = selectedEvent;

  const t = useTranslations("itinerary.eventDetailsCard");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_DETAILS_DIALOG;

  const getFormattedOpeningHours = (openingHours: string[]): string => {
    if (openingHours.length == 0) return "NA";

    const groupedHours: { days: string[]; hours: string }[] = [];

    openingHours.forEach((entry) => {
      const [day, hours] = entry.split(": ");

      if (
        !groupedHours.length ||
        groupedHours[groupedHours.length - 1].hours !== hours
      ) {
        groupedHours.push({ days: [day], hours });
      } else {
        groupedHours[groupedHours.length - 1].days.push(day);
      }
    });

    let output: string = "";

    groupedHours.map(({ days, hours }) => {
      if (days.length === 1) {
        output += `${days[0].slice(0, 3)} | ${hours}\n`;
      } else {
        output += `${days[0].slice(0, 3)} - ${days[days.length - 1].slice(0, 3)} | ${hours}\n`;
      }
    });

    return output;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: styles.SPACING,
      }}
    >
      <Text
        text={t("openingHours") + ": "}
        variant={TypographyVariant.body1}
        bold={true}
        color={colorsConst.palette.text.primary}
      />
      <Text
        text={event ? getFormattedOpeningHours(event.openingHours) : ""}
        variant={TypographyVariant.body1}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
    </Box>
  );
};

export default OpeningHours;
