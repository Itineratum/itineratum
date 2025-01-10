import { EventCardTimeOfDay } from "@/app/[locale]/itinerary/components/event-card";
import { getDays } from "@/utils/itinerary";
import { DayPlan, Event, Hotel } from "./types";
import {
  setDefaults,
  OutputFormat,
  fromAddress,
  fromLatLng,
} from "react-geocode";

export const getEvents = async (rawTimePeriodPlan: any[]): Promise<Event[]> => {
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const events: Event[] = [];

  for (const item of rawTimePeriodPlan) {
    const { results } = await fromAddress(item.location_address);
    const { lat, lng } = results[0].geometry.location;
    events.push({
      is_hotel: item.is_hotel ? item.is_hotel : false,
      event_name: item.location_name,
      location_name: item.display_name ? item.display_name.text : "",
      location_address: item.location_address,
      coordinates: {
        lat,
        lng,
      },
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
  }

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

export const formatItinerary = async (
  itineraryRaw: any,
): Promise<DayPlan[]> => {
  const itinerary: DayPlan[] = [];
  itineraryRaw = itineraryRaw.filter(
    (destinationPlan: any) =>
      destinationPlan.plan && destinationPlan.plan.length > 0,
  );

  for (const destinationPlan of itineraryRaw) {
    const days = getDays(destinationPlan.day);
    const destination = destinationPlan.location;

    for (let index = 0; index < destinationPlan.plan.length; index++) {
      const rawDayPlan = destinationPlan.plan[index];
      const morning = await getEvents(rawDayPlan.morning);
      const afternoon = await getEvents(rawDayPlan.afternoon);
      const evening = await getEvents(rawDayPlan.evening);
      const dayPlan: DayPlan = {
        destination,
        day: days[index],
        morning,
        afternoon,
        evening,
      };
      itinerary.push(dayPlan);
    }
  }
  return itinerary;
};

export const getTimeOfDay = (
  time: string | null | undefined,
): EventCardTimeOfDay => {
  if (!time) return EventCardTimeOfDay.morning;

  const [hour, minutePart] = time.toLowerCase().split(":");
  const period = minutePart.slice(-2);

  let hour24 = parseInt(hour);
  if (period === "pm" && hour24 !== 12) {
    hour24 += 12;
  }
  if (period === "am" && hour24 === 12) {
    hour24 = 0;
  }

  if (hour24 >= 6 && hour24 < 12) {
    return EventCardTimeOfDay.morning;
  } else if (hour24 >= 12 && hour24 < 18) {
    return EventCardTimeOfDay.afternoon;
  } else if (hour24 >= 18 && hour24 < 24) {
    return EventCardTimeOfDay.evening;
  } else {
    return EventCardTimeOfDay.morning;
  }
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

interface Coordinates {
  lat: number;
  lng: number;
}

export const getHotelLocationAddress = async (
  coordinates: Coordinates,
): Promise<string> => {
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const { results } = await fromLatLng(coordinates.lat, coordinates.lng);
  return results[0].formatted_address;
};
