import { getDays } from "@/utils/itinerary";
import { DayPlan, Event, Hotel } from "./types";

export const getEvents = (rawTimePeriodPlan: any[]): Event[] => {
  const events: Event[] = [];

  rawTimePeriodPlan.map((item) => {
    events.push({
      is_hotel: item.is_hotel ? item.is_hotel : false,
      event_name: item.location_name,
      location_name: item.display_name ? item.display_name.text : "",
      location_address: item.location_address,
      coordinates: null,
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
      checkInTime: null,
      checkOutTime: null,
    });
  });
  return events;
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

export const formatItinerary = (itineraryRaw: any): DayPlan[] => {
  const itinerary: DayPlan[] = [];
  itineraryRaw = itineraryRaw.filter(
    (destinationPlan: any) =>
      destinationPlan.plan && destinationPlan.plan.length > 0,
  );
  itineraryRaw.forEach((destinationPlan: any) => {
    const days = getDays(destinationPlan.day);
    const destination = destinationPlan.location;
    destinationPlan.plan.forEach((rawDayPlan: any, index: number) => {
      const dayPlan: DayPlan = {
        destination,
        day: days[index],
        morning: getEvents(rawDayPlan.morning),
        afternoon: getEvents(rawDayPlan.afternoon),
        evening: getEvents(rawDayPlan.evening),
      };
      itinerary.push(dayPlan);
    });
  });
  return itinerary;
};

export const formatHotels = (hotelsRaw: any): Hotel[][] => {
  const hotels: Hotel[][] = [];
  hotelsRaw.forEach((destinationHotelsRaw: any[]) => {
    const destinationHotels: Hotel[] = [];
    destinationHotelsRaw.forEach((hotelRaw: any) => {
      const hotel: Hotel = {
        type: hotelRaw.type,
        name: hotelRaw.name,
        description: hotelRaw.description,
        url: hotelRaw.link,
        coordinates: {
          latitude: hotelRaw.gps_coordinates.latitude,
          longitude: hotelRaw.gps_coordinates.longitude,
        },
        check_in_time: hotelRaw.check_in_time,
        check_out_time: hotelRaw.check_out_time,
        rate_per_night: hotelRaw.rate_per_night.extracted_lowest,
        hotel_class: hotelRaw.extracted_hotel_class,
        images: hotelRaw.images.map((image: any) => image.original_image),
        rating: hotelRaw.overall_rating,
        num_reviews: hotelRaw.reviews,
        location_rating: hotelRaw.location_rating,
        amenities: hotelRaw.amenities,
      };
      destinationHotels.push(hotel);
    });
    hotels.push(destinationHotels);
  });
  return hotels;
};

export const noHotelEvents = (dayPlan: DayPlan): boolean => {
  return (
    dayPlan.morning.every((event: Event) => !event.is_hotel) &&
    dayPlan.afternoon.every((event: Event) => !event.is_hotel) &&
    dayPlan.evening.every((event: Event) => !event.is_hotel)
  );
};

export const clearHotelEvents = (dayPlan: DayPlan) => {
  const hasHotelEvents: boolean[] = [false, false, false];

  dayPlan.morning.forEach((event: Event) => {
    if (event.is_hotel) {
      hasHotelEvents[0] = true;
    }
  });
  dayPlan.afternoon.forEach((event: Event) => {
    if (event.is_hotel) {
      hasHotelEvents[1] = true;
    }
  });
  dayPlan.evening.forEach((event: Event) => {
    if (event.is_hotel) {
      hasHotelEvents[2] = true;
    }
  });

  hasHotelEvents.forEach((hasHotelEvent: boolean, index: number) => {
    if (hasHotelEvent) {
      if (index === 0) dayPlan.morning.shift();
      else if (index === 1) dayPlan.afternoon.shift();
      else if (index === 2) dayPlan.evening.shift();
    }
  });
};
