import { EventTimeOfDay } from "@/lib/pythonBackend/types";

export interface AddNewEventFormData {
  locationName: string;
  timeOfDay: EventTimeOfDay;
}
