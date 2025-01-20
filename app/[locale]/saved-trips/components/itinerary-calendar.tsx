import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import events from "./events";
import { useState, useCallback, SetStateAction } from "react";
import dayjs, { Dayjs } from "dayjs";

const ItineraryCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [view, setView] = useState<string>(Views.MONTH);

  const onNavigate = useCallback(
    (newDate: Date) => setDate(dayjs(newDate)),
    [setDate],
  );
  const onView = useCallback((newView: string) => setView(newView), [setView]);

  return (
    <div style={{ height: 700 }}>
      <Calendar
        date={date.toDate()}
        events={events}
        localizer={localizer}
        onNavigate={onNavigate}
        onView={onView}
        view={view as View}
      />
    </div>
  );
};

export default ItineraryCalendar;
