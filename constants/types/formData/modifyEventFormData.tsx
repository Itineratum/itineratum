import { EventTimeOfDay } from "@/lib/pythonBackend/types";

export interface ModifyEventFormData {
  locationName: string;
  locationCity: string;
  timeOfDay: EventTimeOfDay;
  dayNum: number; // for shifting events to other days of the itinerary
}
