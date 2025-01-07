import { Event } from "./types";

export const getTimePeriodPlan = (rawTimePeriodPlan: any[]): Event[] => {
  const timePeriodPlan: Event[] = [];

  rawTimePeriodPlan.map((item) => {
    timePeriodPlan.push({
      event_name: item.location_name,
      location_name: item.display_name ? item.display_name.text : "",
      location_address: item.location_address,
      description: item.description,
      rating: item.rating ? item.rating : 0,
      website_uri: item.website_uri ? item.website_uri : "",
      photo: item.photos && item.photos.length > 0 ? item.photos[0].name : "",
      openingHours:
        item.opening_hours &&
        item.opening_hours.weekdayDescriptions &&
        item.opening_hours.weekdayDescriptions.length > 0
          ? item.opening_hours.weekdayDescriptions
          : [],
    });
  });
  return timePeriodPlan;
};

export const extractPlaceId = (input: string): string | null => {
  const start = "places/";
  const end = "/photos";

  const startIndex = input.indexOf(start) + start.length;
  const endIndex = input.indexOf(end);

  if (startIndex >= 0 && endIndex > startIndex) {
    return input.substring(startIndex, endIndex);
  }

  return null;
};
