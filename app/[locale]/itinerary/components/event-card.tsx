"use client";

import Text from "@/components/atoms/text";
import { ItineraryEditAction } from "@/components/templates/itinerary-page";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Event, EventTimeOfDay } from "@/lib/pythonBackend/types";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

export const eventCardMaxWidth = 515;

const EventCard = ({
  date,
  destination,
  timeOfDay,
  setSelectedEvent,
  event,
  selected,
  isEditing,
  setEdit,
  index,
}: {
  date: Dayjs;
  destination: string;
  timeOfDay: EventTimeOfDay;
  setSelectedEvent: any;
  event: Event;
  selected: boolean;
  isEditing: boolean;
  setEdit: Dispatch<SetStateAction<Record<ItineraryEditAction, number> | null>>;
  index: number;
}) => {
  const color = event.is_hotel
    ? colorsConst.components.mapSection.hotel
    : timeOfDay === EventTimeOfDay.morning
      ? colorsConst.components.eventCard.morning
      : timeOfDay === EventTimeOfDay.afternoon
        ? colorsConst.components.eventCard.afternoon
        : colorsConst.components.eventCard.evening;
  const iconSize = 36;
  const padding = 2;
  const borderRadius = "30px";
  const maxWidth = eventCardMaxWidth;
  const maxHeight = "230px";
  const border = selected ? `6px solid ${color}` : "2px solid black";

  const removeButton = () => {
    const iconSize = 37;

    const handleOnClick = () => {
      const newEdit: Record<ItineraryEditAction, number> = {
        [ItineraryEditAction.delete]: index,
      };
      setEdit(newEdit);
    };

    return (
      <IconButton
        onClick={handleOnClick}
        sx={{
          position: "absolute",
          top: -16,
          left: -16,
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
            height: iconSize,
            width: iconSize,
          }}
        />
      </IconButton>
    );
  };

  const leftAvatar = () => {
    const size = 70;
    const circleSize = 24;

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
            top: "50%",
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
        <Stack
          direction="row"
          alignItems="center"
          textAlign="left"
          spacing={spacing}
        >
          <CalendarTodayIcon
            sx={{ color, width: iconSize, height: iconSize }}
          />
          <Text
            text={`${date.format("DD MMM YYYY")}\n${timeOfDay}`}
            variant={TypographyVariant.h6}
            bold={false}
          />
        </Stack>
      );
    };

    const locationSection = () => {
      const spacing: number = 2;

      return (
        <Stack
          direction="row"
          alignItems="center"
          spacing={spacing}
          textAlign="left"
        >
          <LocationOnIcon sx={{ color, width: iconSize, height: iconSize }} />
          <Text
            text={`${event.event_name}, ${destination}`}
            variant={TypographyVariant.h6}
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

  const handleOnClick = () => {
    setSelectedEvent(event);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        maxWidth,
        maxHeight,
      }}
    >
      {isEditing && removeButton()}
      <Button
        onClick={handleOnClick}
        sx={{
          display: "flex",
          alignItems: "center",
          padding,
          border,
          borderRadius,
          maxWidth,
          maxHeight,
        }}
      >
        {leftAvatar()}
        {eventDetails()}
      </Button>
    </Box>
  );
};

export default EventCard;
