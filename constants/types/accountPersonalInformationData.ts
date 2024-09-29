import { Dayjs } from "dayjs";

export interface AccountPersonalInformationFormData {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  dateOfBirth: Dayjs | null;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  reEnterNewPassword: string;
}
