import { ObjectId } from "mongodb";

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  itineraryId: string | null;
  _id: ObjectId | null;
}

export const defaultCalendarEvent: CalendarEvent = {
  title: "",
  start: new Date(),
  end: new Date(),
  itineraryId: "",
  _id: null,
};
