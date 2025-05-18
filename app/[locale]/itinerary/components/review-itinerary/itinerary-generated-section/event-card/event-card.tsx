"use client";

import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event, EventTimeOfDay } from "@/lib/pythonBackend/types";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Stack } from "@mui/material";
import dayjs from "dayjs";
import { ITINERARY_STYLES } from "../../../styles";
import {
  ItineraryEditAction,
  ReorderEventInItineraryDetails
} from "../../review-itinerary";
import AddButton from "./add-button";
import DeleteButton from "./delete-button";
import DownButton from "./down-button";
import EventDetails from "./event-details";
import LeftAvatar from "./left-avatar";
import ModifyButton from "./modify-button";
import UpButton from "./up-button";

const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const {
    itineraryData,
    dayNum,
    setSelectedEvent,
    selectedEvent,
    isEditing,
    setCurrentEdit,
    events,
    setShowSnackbar,
  } = useReviewItinerary();

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_CARD;

  const startDate = itineraryData
    ? dayjs(itineraryData.request.payload.start_date)
    : dayjs();
  const date = dayNum === 1 ? startDate : startDate.add(dayNum - 1, "day");
  const timeOfDay = event.time_of_day;
  const selected = JSON.stringify(event) === JSON.stringify(selectedEvent);

  const color = event.is_hotel
    ? colorsConst.components.mapSection.hotel
    : timeOfDay === EventTimeOfDay.morning
      ? colorsConst.components.eventCard.morning
      : timeOfDay === EventTimeOfDay.afternoon
        ? colorsConst.components.eventCard.afternoon
        : colorsConst.components.eventCard.evening;
  const border = selected ? `6px solid ${color}` : "2px solid black";

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
      dragEvent.dataTransfer.getData("text/plain")
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
    <Box>
      <Stack direction="column" spacing={styles.SPACING}>
        {isEditing && index === 0 && <AddButton indexToAddEventTo={index} />}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            maxWidth: styles.MAX_WIDTH,
            maxHeight: { xs: "none", md: styles.MAX_HEIGHT },
            gap: styles.SPACING,
          }}
          draggable={isEditing}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isEditing && <DeleteButton index={index} event={event} />}
          {isEditing && !event.is_hotel && <ModifyButton index={index} />}
          {/* mobile rearrangement controls */}
          {isEditing && (
            <Box>
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  flexDirection: "column",
                  gap: styles.SPACING,
                }}
              >
                <UpButton index={index} />
                <DownButton index={index} />
              </Box>
              <MenuIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "-10%",
                  color: "black",
                  display: { xs: "none", md: "flex" },
                }}
              />
            </Box>
          )}
          <Button
            onClick={handleOnClick}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: styles.PADDING,
              border,
              borderRadius: styles.BORDER_RADIUS,
            }}
          >
            <LeftAvatar color={color} />
            <EventDetails event={event} color={color} date={date} />
          </Button>
        </Box>
        {isEditing && <AddButton indexToAddEventTo={index + 1} />}
      </Stack>
    </Box>
  );
};

export default EventCard;
