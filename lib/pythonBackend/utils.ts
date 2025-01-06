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
      photo: item.photos ? item.photos[0].name : "",
    });
  });
  return timePeriodPlan;
};

export const getGooglePlacePhotoEndpoint = (
  photoString: string,
  maxHeight: number,
  maxWidth: number,
): string => {
  return `https://places.googleapis.com/v1/${photoString}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;
};
