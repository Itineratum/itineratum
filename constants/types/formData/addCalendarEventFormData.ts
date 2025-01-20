import { Dayjs } from "dayjs";

export interface AddCalendarEventFormData {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
}
