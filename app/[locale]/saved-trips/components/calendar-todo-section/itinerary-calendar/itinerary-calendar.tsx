import { CalendarEvent } from "@/constants/types/calendarEvent";
import { UserCalendarEventProvider } from "@/contexts/userCalendarEventContext";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import { Box, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { Calendar, dayjsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SAVED_TRIPS_STYLES } from "../../styles";
import AddCalendarEventButton from "./add-calendar-event-button";
import UserCalendarEventDialog from "./user-calendar-event-dialog/user-calendar-event-dialog";

const ItineraryCalendar = ({}: {}) => {
  const {
    savedItineraries,
    setSelectedItineraryId,
    userCalendarEvents,
    setSelectedUserCalendarEvent,
    setUserCalendarEventDialogOpen,
    selectedUserCalendarEvent,
  } = useSavedTrips();

  const localizer = dayjsLocalizer(dayjs);
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [view, setView] = useState<string>(Views.MONTH);

  const styles = SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.ITINERARY_CALENDAR;

  const onNavigate = useCallback(
    (newDate: Date) => setDate(dayjs(newDate)),
    [setDate],
  );
  const onView = useCallback((newView: string) => setView(newView), [setView]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

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

  return (
    <Stack direction="column" spacing={styles.SPACING}>
      <Box display="flex" justifyContent="flex-end">
        <AddCalendarEventButton />
      </Box>
      <Box sx={{ height: styles.HEIGHT }}>
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
      <UserCalendarEventProvider>
        {selectedUserCalendarEvent && (
          <UserCalendarEventDialog
            key={JSON.stringify(selectedUserCalendarEvent)}
          />
        )}
      </UserCalendarEventProvider>
    </Stack>
  );
};

export default ItineraryCalendar;
