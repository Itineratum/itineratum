export const getDays = (dayRange: string): number[] => {
  const dashIndex = dayRange.indexOf("-");
  const startDay = Number(dayRange.slice(0, dashIndex));
  const endDay = Number(dayRange.slice(dashIndex + 1));
  return Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
};
