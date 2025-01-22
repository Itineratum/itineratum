import { EventTimeOfDay } from "@/lib/pythonBackend/types";

export interface ModifyEventFormData {
  locationName: string;
  locationCity: string;
  timeOfDay: EventTimeOfDay;
}
