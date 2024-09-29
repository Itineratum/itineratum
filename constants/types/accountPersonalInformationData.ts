import { Dayjs } from "dayjs";

export interface AccountPersonalInformationData {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  dateOfBirth: Dayjs | null;
}
