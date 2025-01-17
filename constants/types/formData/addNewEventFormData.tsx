import { EventTimeOfDay } from "@/lib/pythonBackend/types";
import dayjs, { Dayjs } from "dayjs";

export interface AddNewEventFormData {
  isHotelEvent: boolean;
  locationName: string;
  locationCity: string;
  timeOfDay: EventTimeOfDay;
  checkInTime: Dayjs | null;
  checkOutTime: Dayjs | null;
}
