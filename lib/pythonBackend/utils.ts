import { EventCardTimeOfDay } from "@/app/[locale]/itinerary/components/event-card";
import { getDays } from "@/utils/itinerary";
import dayjs from "dayjs";
import {
  OutputFormat,
  fromAddress,
  fromLatLng,
  setDefaults,
} from "react-geocode";
import { DayPlan, Event, Hotel } from "./types";
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
    let photo =
      item.photos && item.photos.length > 0 ? item.photos[0].name : "";

    if (photo.startsWith("places/")) {
      const googlePlacePhotoEndpoint = getGooglePlacePhotoEndpoint(photo);
      const response = await fetch(googlePlacePhotoEndpoint);

      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }

      const photoJson = await response.json();
      photo = photoJson.photoUri;
    }

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
      photo,
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

export const getGooglePlacePhotoEndpoint = (photoString: string): string => {
  const maxWidth = 1087;

  return `https://places.googleapis.com/v1/${photoString}/media?maxWidthPx=${maxWidth}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&skipHttpRedirect=true`;
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

export const getTripCheckInCheckOutDays = (
  userRequestedDestinations: any,
  tripStartDate: dayjs.Dayjs,
  tripEndDate: dayjs.Dayjs,
): number[][] => {
  const tripCheckInCheckOutDays: number[][] = [];

  for (const userRequestedDestination of userRequestedDestinations) {
    const destinationCheckInCheckOutDays: number[] = [];
    const destinationStartDate = dayjs(userRequestedDestination.start_date).utc(
      true,
    );
    const destinationEndDate = dayjs(userRequestedDestination.end_date).utc(
      true,
    );

    if (destinationStartDate.isSame(tripStartDate)) {
      destinationCheckInCheckOutDays.push(1);
    } else {
      const dayOfTripOfDestinationStartDate =
        destinationStartDate.diff(tripStartDate, "day") + 1;
      destinationCheckInCheckOutDays.push(dayOfTripOfDestinationStartDate);
    }

    if (destinationEndDate.isSame(tripEndDate)) {
      destinationCheckInCheckOutDays.push(
        tripEndDate.diff(tripStartDate, "day") + 1,
      );
    } else {
      const dayOfTripOfDestinationEndDate =
        destinationEndDate.diff(tripStartDate, "day") + 1;
      destinationCheckInCheckOutDays.push(dayOfTripOfDestinationEndDate);
    }

    tripCheckInCheckOutDays.push(destinationCheckInCheckOutDays);
  }

  return tripCheckInCheckOutDays;
};

export const adjustItineraryWithSelectedHotels = async (
  selectedHotels: Hotel[],
  tripCheckInCheckOutDays: number[][],
  itinerary: DayPlan[],
) => {
  for (
    let destinationIndex = 0;
    destinationIndex < selectedHotels.length;
    destinationIndex++
  ) {
    const hotel: Hotel | null = selectedHotels[destinationIndex];

    if (!hotel) continue;

    const hotelCheckInDay = tripCheckInCheckOutDays[destinationIndex][0];
    const hotelCheckOutDay = tripCheckInCheckOutDays[destinationIndex][1];
    const hotelCheckInTimePeriod = getTimeOfDay(hotel.check_in_time);
    const hotelCheckOutTimePeriod = getTimeOfDay(hotel.check_out_time);
    const hotelLocationAddress = await getHotelLocationAddress({
      lat: hotel.coordinates.latitude,
      lng: hotel.coordinates.longitude,
    });
    const hotelCheckInEvent: Event = {
      is_hotel: true,
      event_name: `Check in to ${hotel.name}`,
      location_name: hotel.name,
      location_address: hotelLocationAddress,
      coordinates: {
        lat: hotel.coordinates.latitude,
        lng: hotel.coordinates.longitude,
      },
      description: hotel.description,
      rating: hotel.rating,
      website_uri: hotel.url,
      photo: hotel.images[0],
      openingHours: [],
      checkInTime: hotel.check_in_time,
      checkOutTime: hotel.check_out_time,
    };
    const hotelCheckOutEvent: Event = {
      ...hotelCheckInEvent,
      event_name: `Check out from ${hotel.name}`,
      location_name: hotel.name,
    };

    itinerary.forEach((dayPlan: DayPlan) => {
      const day = dayPlan.day;

      if (hotelCheckInDay === day) {
        if (hotelCheckInTimePeriod === EventCardTimeOfDay.morning) {
          if (noHotelEvents(dayPlan)) {
            dayPlan.morning.unshift(hotelCheckInEvent);
          } else {
            clearHotelEvents(dayPlan);
            dayPlan.morning.unshift(hotelCheckInEvent);
          }
        } else if (hotelCheckInTimePeriod === EventCardTimeOfDay.afternoon) {
          if (noHotelEvents(dayPlan)) {
            dayPlan.afternoon.unshift(hotelCheckInEvent);
          } else {
            clearHotelEvents(dayPlan);
            dayPlan.afternoon.unshift(hotelCheckInEvent);
          }
        } else {
          if (noHotelEvents(dayPlan)) {
            dayPlan.evening.unshift(hotelCheckInEvent);
          } else {
            clearHotelEvents(dayPlan);
            dayPlan.evening.unshift(hotelCheckInEvent);
          }
        }
      } else if (hotelCheckOutDay === day) {
        if (hotelCheckOutTimePeriod === EventCardTimeOfDay.morning) {
          if (noHotelEvents(dayPlan)) {
            dayPlan.morning.unshift(hotelCheckOutEvent);
          } else {
            clearHotelEvents(dayPlan);
            dayPlan.morning.unshift(hotelCheckOutEvent);
          }
        } else if (hotelCheckOutTimePeriod === EventCardTimeOfDay.afternoon) {
          if (noHotelEvents(dayPlan)) {
            dayPlan.afternoon.unshift(hotelCheckOutEvent);
          } else {
            clearHotelEvents(dayPlan);
            dayPlan.afternoon.unshift(hotelCheckOutEvent);
          }
        } else {
          if (noHotelEvents(dayPlan)) {
            dayPlan.evening.unshift(hotelCheckOutEvent);
          } else {
            clearHotelEvents(dayPlan);
            dayPlan.evening.unshift(hotelCheckOutEvent);
          }
        }
      }
    });
  }
};
