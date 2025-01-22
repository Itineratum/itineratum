"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Event, EventTimeOfDay } from "@/lib/pythonBackend/types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, Button, IconButton, Menu, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import {
  ItineraryEditAction,
  ItineraryEditDetails,
  DeleteEventFromItineraryDetails,
  ReorderEventInItineraryDetails,
} from "./review-itinerary";
import MenuIcon from "@mui/icons-material/Menu";

export const eventCardMaxWidth = 515;

const EventCard = ({
  date,
  destination,
  timeOfDay,
  setSelectedEvent,
  event,
  selected,
  isEditing,
  setCurrentEdit,
  index,
  setAddEventDialogOpen,
  setIndexToAddEventTo,
  setModifyEventDialogOpen,
  setIndexToModifyEventAt,
  events,
  setShowSnackbar,
}: {
  date: Dayjs;
  destination: string;
  timeOfDay: EventTimeOfDay;
  setSelectedEvent: any;
  event: Event;
  selected: boolean;
  isEditing: boolean;
  setCurrentEdit: Dispatch<
    SetStateAction<Partial<
      Record<ItineraryEditAction, ItineraryEditDetails>
    > | null>
  >;
  index: number;
  setAddEventDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIndexToAddEventTo: Dispatch<SetStateAction<number | null>>;
  setModifyEventDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIndexToModifyEventAt: Dispatch<SetStateAction<number | null>>;
  events: Event[];
  setShowSnackbar: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("itinerary");

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
  const spacing = 2;

  const deleteButton = () => {
    const handleOnClick = () => {
      const newEdit: Partial<
        Record<ItineraryEditAction, DeleteEventFromItineraryDetails>
      > = {
        [ItineraryEditAction.delete]: {
          indexToDeleteEventFrom: index,
          event,
        },
      };
      setCurrentEdit(newEdit);
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

  const modifyButton = () => {
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
            height: iconSize,
            width: iconSize,
          }}
        />
      </IconButton>
    );
  };

  const addButton = (indexToAddEventTo: number) => {
    const spacing = 2;

    const handleOnClick = () => {
      setIndexToAddEventTo(indexToAddEventTo);
      setAddEventDialogOpen(true);
    };

    return (
      <IconButton onClick={handleOnClick}>
        <Stack
          direction="row"
          spacing={spacing}
          display="flex"
          alignItems="center"
        >
          <AddCircleOutlineIcon
            sx={{
              color: colorsConst.palette.text.primary,
              height: iconSize,
              width: iconSize,
            }}
          />
          <Text
            text={t("addActivity")}
            variant={TypographyVariant.body1}
            bold={false}
            color={colorsConst.palette.text.primary}
          />
        </Stack>
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

  const handleDragStart = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.preventDefault();
    const oldEventIndex = parseInt(
      dragEvent.dataTransfer.getData("text/plain"),
    );
    const newEventIndex = index;
    const movedEvent = events[oldEventIndex];

    // if the event has not even been reordered at all
    if (oldEventIndex === newEventIndex) return;

    // if the event moved beyond its time of day (i.e., a morning event moved to afternoon)
    if (movedEvent.time_of_day !== events[newEventIndex].time_of_day) {
      setShowSnackbar(true);
      return;
    }

    const newEdit: Partial<
      Record<ItineraryEditAction, ReorderEventInItineraryDetails>
    > = {
      [ItineraryEditAction.reorder]: {
        event: movedEvent,
        oldEventIndex,
        newEventIndex,
      },
    };
    setCurrentEdit(newEdit);
  };

  return (
    <Stack direction="column" spacing={spacing}>
      {isEditing && index === 0 && addButton(index)}
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          maxWidth,
          maxHeight,
        }}
        draggable={isEditing}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isEditing && deleteButton()}
        {isEditing && !event.is_hotel && modifyButton()}
        {isEditing && (
          <MenuIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: "-10%",
              color: "black",
            }}
          />
        )}
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
      {isEditing && addButton(index + 1)}
    </Stack>
  );
};

export default EventCard;
