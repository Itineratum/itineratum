import colorsConst from "@/constants/pages/colors.json";
import { CalendarEvent } from "@/constants/types/calendarEvent";
import { IItinerary } from "@/constants/types/itinerary";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import AddIcon from "@mui/icons-material/Add";
import { Box, IconButton, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Calendar, dayjsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import UserCalendarEventDialog from "./user-calendar-event-dialog";

const ItineraryCalendar = ({
  savedItineraries,
  setSelectedItineraryId,
  setShowAddCalendarEventDialog,
  userCalendarEvents,
}: {
  savedItineraries: Record<string, IItinerary>[];
  setSelectedItineraryId: Dispatch<SetStateAction<string | null>>;
  setShowAddCalendarEventDialog: Dispatch<SetStateAction<boolean>>;
  userCalendarEvents: CalendarEvent[];
}) => {
  const localizer = dayjsLocalizer(dayjs);
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [view, setView] = useState<string>(Views.MONTH);

  const spacing = 2;
  const calendarHeight = "600px";

  const onNavigate = useCallback(
    (newDate: Date) => setDate(dayjs(newDate)),
    [setDate],
  );
  const onView = useCallback((newView: string) => setView(newView), [setView]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [userCalendarEventDialogOpen, setUserCalendarEventDialogOpen] =
    useState<boolean>(false);
  const [selectedUserCalendarEvent, setSelectedUserCalendarEvent] =
    useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (savedItineraries && savedItineraries.length > 0) {
      const newCalendarEvents: CalendarEvent[] = [];

      savedItineraries.forEach((record) => {
        const itineraryId = Object.keys(record)[0];
        const itinerary = record[itineraryId];
        const title = getItinerarySummaryText(itinerary);
        const start = dayjs(itinerary.request.payload.start_date).toDate();
        const end = dayjs(itinerary.request.payload.end_date)
          .add(1, "day")
          .toDate();
        const calendarEvent: CalendarEvent = {
          title,
          start,
          end,
          itineraryId,
          _id: null,
        };
        newCalendarEvents.push(calendarEvent);
      });

      userCalendarEvents.forEach((userCalendarEvent) => {
        userCalendarEvent.start = new Date(userCalendarEvent.start);
        userCalendarEvent.end = new Date(userCalendarEvent.end);
        newCalendarEvents.push(userCalendarEvent);
      });
      setCalendarEvents(newCalendarEvents);
    }
  }, [savedItineraries, userCalendarEvents]);

  const handleOnSelectEvent = (calendarEvent: CalendarEvent) => {
    // if it is an itinerary calendar event
    if (calendarEvent.itineraryId) {
      setSelectedUserCalendarEvent(null);
      setSelectedItineraryId(calendarEvent.itineraryId);
    } else {
      // else if it is a regular user calendar event
      setSelectedItineraryId(null);
      setSelectedUserCalendarEvent(calendarEvent);
      setUserCalendarEventDialogOpen(true);
    }
  };

  const addCalendarEventButton = () => {
    const handleOnClick = () => {
      setShowAddCalendarEventDialog(true);
    };

    return (
      <IconButton
        onClick={handleOnClick}
        sx={{ color: colorsConst.palette.text.primary }}
      >
        <AddIcon />
      </IconButton>
    );
  };

  return (
    <Stack direction="column" spacing={spacing}>
      <Box display="flex" justifyContent="flex-end">
        {addCalendarEventButton()}
      </Box>
      <Box sx={{ height: calendarHeight }}>
        <Calendar
          date={date.toDate()}
          events={calendarEvents}
          localizer={localizer}
          onNavigate={onNavigate}
          onView={onView}
          onSelectEvent={handleOnSelectEvent}
          view={view as View}
        />
      </Box>
      {selectedUserCalendarEvent && (
        <UserCalendarEventDialog
          key={JSON.stringify(selectedUserCalendarEvent)}
          open={userCalendarEventDialogOpen}
          setOpen={setUserCalendarEventDialogOpen}
          calendarEvent={selectedUserCalendarEvent!}
        />
      )}
    </Stack>
  );
};

export default ItineraryCalendar;
