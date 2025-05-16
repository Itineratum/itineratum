import dayjs from "dayjs";

export const validateDates = (
  from: dayjs.Dayjs | null,
  to: dayjs.Dayjs | null,
  numOfDestinations: number
) => {
  if (from && to) {
    return to.diff(from, "days") + 1 >= numOfDestinations;
  }
  return false;
};
