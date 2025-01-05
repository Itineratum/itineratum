import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";

const EventCard = ({
  date,
  location,
  destination,
  timeOfDay,
}: {
  date: Dayjs;
  location: string;
  destination: string;
  timeOfDay: EventCardTimeOfDay;
}) => {
  const t = useTranslations("itinerary.eventCard");

  const color =
    timeOfDay === EventCardTimeOfDay.morning
      ? colorsConst.components.eventCard.morning
      : timeOfDay === EventCardTimeOfDay.afternoon
        ? colorsConst.components.eventCard.afternoon
        : colorsConst.components.eventCard.evening;
  const iconSize = 48;
  const padding = 4;
  const borderRadius = "30px";
  const maxWidth = "515px";

  const leftAvatar = () => {
    const size = 90;
    const circleSize = 30;

    return (
      <Box sx={{ position: "relative", marginRight: 2 }}>
        <Box
          sx={{
            borderRadius: "50%",
            width: size,
            height: size,
            backgroundColor: colorsConst.components.eventCard.background,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      </Box>
    );
  };

  const eventDetails = () => {
    const spacing: number = 2;

    const timeSection = () => {
      return (
        <Stack direction="row" alignItems="center" spacing={spacing}>
          <CalendarTodayIcon
            sx={{ color, width: iconSize, height: iconSize }}
          />
          <Stack direction="column" spacing={0}>
            <Text
              text={date.format("DD MMM YYYY")}
              variant={TypographyVariant.h5}
              bold={false}
            />
            <Text
              text={timeOfDay}
              variant={TypographyVariant.h5}
              bold={false}
            />
          </Stack>
        </Stack>
      );
    };

    const locationSection = () => {
      const spacing: number = 2;

      return (
        <Stack direction="row" alignItems="center" spacing={spacing}>
          <LocationOnIcon sx={{ color, width: iconSize, height: iconSize }} />
          <Text
            text={`${location}, ${destination}`}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Stack>
      );
    };

    return (
      <Stack direction="column" spacing={spacing}>
        {timeSection()}
        {locationSection()}
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding,
        border: "2px solid black",
        borderRadius,
        maxWidth,
      }}
    >
      {leftAvatar()}
      {eventDetails()}
    </Box>
  );
};

export enum EventCardTimeOfDay {
  morning = "Morning",
  afternoon = "Afternoon",
  evening = "Evening",
}

export default EventCard;
