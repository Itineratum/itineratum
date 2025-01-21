import { ObjectId } from "mongodb";

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  itineraryId: string | null;
  _id: ObjectId | null;
}
