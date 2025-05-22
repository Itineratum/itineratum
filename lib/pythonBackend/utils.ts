import { IItinerary } from "@/constants/types/itinerary";
import dayjs from "dayjs";
import {
  OutputFormat,
  fromAddress,
  fromLatLng,
  setDefaults,
} from "react-geocode";
import {
  DayPlan,
  Event,
  EventTimeOfDay,
  GenerateItineraryJSON,
  Hotel,
  Position,
  TravelTime,
} from "./types";
import {
  DaySpendingsBreakdown,
  EventSpending,
  ItinerarySpendingsBreakdown,
} from "@/app/[locale]/saved-trips/components/expenses-pie-chart-section/spendings-breakdown";
import { SpendingCategory } from "@/constants/enums/spendingCategory";

export const getEvents = async (
  rawTimePeriodPlan: any[],
  timeOfDay: EventTimeOfDay
): Promise<Event[]> => {
  if (!rawTimePeriodPlan) return [];

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
      time_of_day: timeOfDay,
      location_name:
        (typeof item.display_name === "object" && item.display_name?.text) ||
        item.display_name ||
        "",
      location_address: item.location_address,
      coordinates: {
        lat,
        lng,
      },
      description: item.description ?? "",
      rating: item.rating && item.rating !== "N/A" ? item.rating : 0,
      website_uri:
        item.website_uri && item.website_uri !== "N/A" ? item.website_uri : "",
      photo,
      openingHours:
        item.opening_hours &&
        item.opening_hours !== "N/A" &&
        item.opening_hours.weekdayDescriptions &&
        item.opening_hours.weekdayDescriptions.length > 0
          ? item.opening_hours.weekdayDescriptions
          : [],
      checkInTime: null,
      checkOutTime: null,
      // TODO: add in functionality for the price of an event, and spending category also
      price: null,
      spending_category: SpendingCategory.general,
    });
  }

  return events;
};

export const getGooglePlacePhotoEndpoint = (photoString: string): string => {
  const maxWidth = 1087;
  return `https://places.googleapis.com/v1/${photoString}/media?maxWidthPx=${maxWidth}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&skipHttpRedirect=true`;
};

export const getGoogleDistanceMatrixEndpoint = (
  origin: Position,
  destination: Position
): string => {
  const formattedOrigin = `${origin.lat}%2C${origin.lng}`;
  const formattedDestination = `${destination.lat}%2C${destination.lng}`;
  const mode = "driving";
  return `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${formattedOrigin}&destinations=${formattedDestination}&mode=${mode}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;
};

export const getTravelOriginDestinations = (list: Position[]): Position[][] => {
  const result: Position[][] = [];

  for (let i = 0; i < list.length - 1; i++) {
    result.push([list[i], list[i + 1]]);
  }

  return result;
};

export const getTravelTimes = async (
  itinerary: DayPlan[]
): Promise<TravelTime[][]> => {
  const itineraryTravelTimes: TravelTime[][] = [];

  for (const dayPlan of itinerary) {
    const eventCoordinates: Position[] = dayPlan.events.map(
      (event) => event.coordinates ?? { lat: 0, lng: 0 }
    );
    const originDestinationPairs =
      getTravelOriginDestinations(eventCoordinates);
    const dayPlanTravelTimes: TravelTime[] = [];

    for (const originDestinationPair of originDestinationPairs) {
      const googleDistanceMatrixEndpoint = getGoogleDistanceMatrixEndpoint(
        originDestinationPair[0],
        originDestinationPair[1]
      );
      const response = await fetch(googleDistanceMatrixEndpoint);

      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }

      const distanceMatrixJson = await response.json();

      if (distanceMatrixJson.rows[0].elements[0].status === "OK") {
        const travelTime: TravelTime = {
          distance:
            distanceMatrixJson.rows[0].elements[0].distance.text ??
            "Distance not available",
          duration:
            distanceMatrixJson.rows[0].elements[0].duration.text ??
            "Duration not available",
        };
        dayPlanTravelTimes.push(travelTime);
      } else {
        dayPlanTravelTimes.push({
          distance: "Distance not available",
          duration: "Duration not available",
        });
      }
    }

    itineraryTravelTimes.push(dayPlanTravelTimes);
  }

  return itineraryTravelTimes;
};

export const getDays = (dayRange: string): number[] => {
  const dashIndex = dayRange.indexOf("-");
  const startDay = Number(dayRange.slice(0, dashIndex));
  const endDay = Number(dayRange.slice(dashIndex + 1));
  return Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
};

export const formatItinerary = async (
  itineraryRaw: any
): Promise<DayPlan[]> => {
  const itinerary: DayPlan[] = [];
  itineraryRaw = itineraryRaw.filter(
    (destinationPlan: any) =>
      destinationPlan.plan && destinationPlan.plan.length > 0
  );

  for (const destinationPlan of itineraryRaw) {
    const days = getDays(destinationPlan.day);
    const destination = destinationPlan.location;

    for (let index = 0; index < destinationPlan.plan.length; index++) {
      const rawDayPlan = destinationPlan.plan[index];
      const morningEvents = await getEvents(
        rawDayPlan.morning,
        EventTimeOfDay.morning
      );
      const afternoonEvents = await getEvents(
        rawDayPlan.afternoon,
        EventTimeOfDay.afternoon
      );
      const eveningEvents = await getEvents(
        rawDayPlan.evening,
        EventTimeOfDay.evening
      );
      const dayPlan: DayPlan = {
        destination,
        day: days[index],
        events: morningEvents.concat(afternoonEvents).concat(eveningEvents),
      };
      itinerary.push(dayPlan);
    }
  }
  return itinerary;
};

export const getTimeOfDay = (
  time: string | null | undefined
): EventTimeOfDay => {
  if (!time) return EventTimeOfDay.morning;

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
    return EventTimeOfDay.morning;
  } else if (hour24 >= 12 && hour24 < 18) {
    return EventTimeOfDay.afternoon;
  } else if (hour24 >= 18 && hour24 < 24) {
    return EventTimeOfDay.evening;
  } else {
    return EventTimeOfDay.morning;
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

export const noHotelEvents = (dayPlan: DayPlan): boolean =>
  dayPlan.events.every((event: Event) => !event.is_hotel);

export const clearHotelEvents = (dayPlan: DayPlan) => {
  dayPlan.events = dayPlan.events.filter((event: Event) => !event.is_hotel);
};

export const getHotelLocationAddress = async (
  coordinates: Position
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
  tripEndDate: dayjs.Dayjs
): number[][] => {
  const tripCheckInCheckOutDays: number[][] = [];

  for (const userRequestedDestination of userRequestedDestinations) {
    const destinationCheckInCheckOutDays: number[] = [];
    const destinationStartDate = dayjs(userRequestedDestination.start_date).utc(
      true
    );
    const destinationEndDate = dayjs(userRequestedDestination.end_date).utc(
      true
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
        tripEndDate.diff(tripStartDate, "day") + 1
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

export const getIndexToInsertHotelEventAt = (
  events: Event[],
  hotelEventTimeOfDay: EventTimeOfDay
): number => {
  let output = 0;
  const firstEventInSameTimeOfDayIndex = events.findIndex(
    (event: Event) => event.time_of_day === hotelEventTimeOfDay
  );

  if (firstEventInSameTimeOfDayIndex === -1) {
    if (hotelEventTimeOfDay === EventTimeOfDay.morning) {
      // if there are no morning events, then this hotel event is the first event of the day plan
      output = 0;
    } else if (hotelEventTimeOfDay === EventTimeOfDay.afternoon) {
      // if there are no afternoon events
      const hasMorningEvents: boolean = events.some(
        (event) => event.time_of_day === EventTimeOfDay.morning
      );

      if (hasMorningEvents) {
        // if there are morning events, insert this afternoon hotel event after the last morning event
        output =
          events.findLastIndex(
            (event) => event.time_of_day === EventTimeOfDay.morning
          ) + 1;
      } else {
        // if there are no morning and afternoon events, then this afternoon hotel event will be the first/only event of the day plan, before the evening events (if any)
        output = 0;
      }
    } else if (hotelEventTimeOfDay === EventTimeOfDay.evening) {
      // if there are no evening events
      const hasAfternoonEvents: boolean = events.some(
        (event) => event.time_of_day === EventTimeOfDay.afternoon
      );

      if (hasAfternoonEvents) {
        // if there are afternoon events, insert this evening hotel event after the last afternoon event
        output =
          events.findLastIndex(
            (event) => event.time_of_day === EventTimeOfDay.afternoon
          ) + 1;
      } else {
        // if there are no afternoon and evening events, then this evening hotel event will be the last/only event of the day plan, after the morning events (if any)
        output = events.length;
      }
    }
  } else {
    output = firstEventInSameTimeOfDayIndex;
  }

  return output;
};

export const adjustItineraryWithSelectedHotels = async (
  selectedHotels: Hotel[],
  tripCheckInCheckOutDays: number[][],
  itinerary: DayPlan[]
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
    const hotelCheckInTimeOfDay = getTimeOfDay(hotel.check_in_time);
    const hotelCheckOutTimeOfDay = getTimeOfDay(hotel.check_out_time);
    const hotelLocationAddress = await getHotelLocationAddress({
      lat: hotel.coordinates.latitude,
      lng: hotel.coordinates.longitude,
    });
    const hotelCheckInEvent: Event = {
      is_hotel: true,
      event_name: `Check in to ${hotel.name}`,
      time_of_day: hotelCheckInTimeOfDay,
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
      // TODO: add in functionality for the price of the hotel
      price: null,
      spending_category: SpendingCategory.accommodation,
    };
    const hotelCheckOutEvent: Event = {
      ...hotelCheckInEvent,
      event_name: `Check out from ${hotel.name}`,
      time_of_day: hotelCheckOutTimeOfDay,
      location_name: hotel.name,
    };

    itinerary.forEach((dayPlan: DayPlan) => {
      const day = dayPlan.day;

      if (hotelCheckInDay === day) {
        if (!noHotelEvents(dayPlan)) clearHotelEvents(dayPlan);

        const indexToInsertHotelEventAt = getIndexToInsertHotelEventAt(
          dayPlan.events,
          hotelCheckInTimeOfDay
        );
        dayPlan.events.splice(indexToInsertHotelEventAt, 0, hotelCheckInEvent);
      } else if (hotelCheckOutDay === day) {
        if (!noHotelEvents(dayPlan)) clearHotelEvents(dayPlan);

        const indexToInsertHotelEventAt = getIndexToInsertHotelEventAt(
          dayPlan.events,
          hotelCheckOutTimeOfDay
        );
        dayPlan.events.splice(indexToInsertHotelEventAt, 0, hotelCheckOutEvent);
      }
    });
  }
};

export const hasHotelDeletes = (eventsToDelete: Event[]): boolean =>
  eventsToDelete.some((event: Event) => event.is_hotel);

export const isHotelCheckInEvent = (event: Event): boolean => {
  return event.is_hotel && event.event_name.startsWith("Check in");
};

export const isHotelCheckOutEvent = (event: Event): boolean => {
  return event.is_hotel && event.event_name.startsWith("Check out");
};

export const getCorrespondingHotelCheckInDay = (
  itineraryRequest: GenerateItineraryJSON,
  selectedHotels: Hotel[],
  hotelCheckOutEvent: Event
) => {
  const userRequestedDestinations =
    itineraryRequest.payload.user_requested_destinations;
  const tripStartDate = dayjs(itineraryRequest.payload.start_date).utc(true);
  const tripEndDate = dayjs(itineraryRequest.payload.end_date).utc(true);
  const tripCheckInCheckOutDays = getTripCheckInCheckOutDays(
    userRequestedDestinations,
    tripStartDate,
    tripEndDate
  );
  const hotelIndex = selectedHotels.findIndex(
    (hotel: Hotel) =>
      hotel &&
      hotel.name === hotelCheckOutEvent.location_name &&
      hotel.coordinates.latitude === hotelCheckOutEvent.coordinates?.lat &&
      hotel.coordinates.longitude === hotelCheckOutEvent.coordinates.lng
  );
  const checkInDay = tripCheckInCheckOutDays[hotelIndex][0];
  return checkInDay;
};

export const getCorrespondingHotelCheckOutDay = (
  itineraryRequest: GenerateItineraryJSON,
  selectedHotels: Hotel[],
  hotelCheckInEvent: Event
) => {
  const userRequestedDestinations =
    itineraryRequest.payload.user_requested_destinations;
  const tripStartDate = dayjs(itineraryRequest.payload.start_date).utc(true);
  const tripEndDate = dayjs(itineraryRequest.payload.end_date).utc(true);
  const tripCheckInCheckOutDays = getTripCheckInCheckOutDays(
    userRequestedDestinations,
    tripStartDate,
    tripEndDate
  );
  const hotelIndex = selectedHotels.findIndex(
    (hotel: Hotel) =>
      hotel &&
      hotel.name === hotelCheckInEvent.location_name &&
      hotel.coordinates.latitude === hotelCheckInEvent.coordinates?.lat &&
      hotel.coordinates.longitude === hotelCheckInEvent.coordinates.lng
  );
  const checkOutDay = tripCheckInCheckOutDays[hotelIndex][1];
  return checkOutDay;
};

// deletes the corresponding hotel check out event if the eventsToDelete contains a hotel check in event. else, delete the corresponding hotel check in event if the eventsToDelete contains a hotel check out event
// also deletes the hotel in the selectedHotels array
export const deleteCorrespondingHotelEvents = (
  eventsToDelete: Event[],
  itineraryRequest: GenerateItineraryJSON,
  selectedHotels: any[],
  itinerary: DayPlan[]
): Hotel[] => {
  const hotelEventToDelete: Event = eventsToDelete.filter(
    (event: Event) => event.is_hotel
  )[0];

  if (isHotelCheckInEvent(hotelEventToDelete)) {
    // if this hotel event is a check in event, then delete the corresponding check out event
    const correspondingCheckOutDay = getCorrespondingHotelCheckOutDay(
      itineraryRequest,
      selectedHotels,
      hotelEventToDelete
    );
    itinerary[correspondingCheckOutDay - 1].events = itinerary[
      correspondingCheckOutDay - 1
    ].events.filter(
      (event: Event) =>
        !(
          event.is_hotel &&
          event.location_name === hotelEventToDelete.location_name &&
          event.coordinates?.lat === hotelEventToDelete.coordinates?.lat &&
          event.coordinates?.lng === hotelEventToDelete.coordinates?.lng
        )
    );
  } else if (isHotelCheckOutEvent(hotelEventToDelete)) {
    // if this hotel event is a check out event, then delete the corresponding check in event
    const correspondingCheckInDay = getCorrespondingHotelCheckInDay(
      itineraryRequest,
      selectedHotels,
      hotelEventToDelete
    );
    itinerary[correspondingCheckInDay - 1].events = itinerary[
      correspondingCheckInDay - 1
    ].events.filter(
      (event: Event) =>
        !(
          event.is_hotel &&
          event.location_name === hotelEventToDelete.location_name &&
          event.coordinates?.lat === hotelEventToDelete.coordinates?.lat &&
          event.coordinates?.lng === hotelEventToDelete.coordinates?.lng
        )
    );
  }

  selectedHotels = selectedHotels.map((hotel: Hotel) => {
    if (
      hotel &&
      hotel.name === hotelEventToDelete.location_name &&
      hotel.coordinates.latitude === hotelEventToDelete.coordinates?.lat &&
      hotel.coordinates.longitude === hotelEventToDelete.coordinates.lng
    ) {
      return null;
    } else return hotel;
  });

  return selectedHotels;
};

export const getTimesOfDayBefore = (
  input: EventTimeOfDay
): EventTimeOfDay[] => {
  if (input === EventTimeOfDay.morning) {
    return [EventTimeOfDay.morning];
  } else if (input === EventTimeOfDay.afternoon) {
    return [EventTimeOfDay.morning, EventTimeOfDay.afternoon];
  } else {
    return [
      EventTimeOfDay.morning,
      EventTimeOfDay.afternoon,
      EventTimeOfDay.evening,
    ];
  }
};

export const getTimesOfDayAfter = (input: EventTimeOfDay): EventTimeOfDay[] => {
  if (input === EventTimeOfDay.morning) {
    return [
      EventTimeOfDay.morning,
      EventTimeOfDay.afternoon,
      EventTimeOfDay.evening,
    ];
  } else if (input === EventTimeOfDay.afternoon) {
    return [EventTimeOfDay.afternoon, EventTimeOfDay.evening];
  } else {
    return [EventTimeOfDay.evening];
  }
};

export const getTimesOfDayBetween = (
  previous: EventTimeOfDay,
  next: EventTimeOfDay
): EventTimeOfDay[] => {
  const timeOrder = [
    EventTimeOfDay.morning,
    EventTimeOfDay.afternoon,
    EventTimeOfDay.evening,
  ];
  const startIndex = timeOrder.indexOf(previous);
  const endIndex = timeOrder.indexOf(next);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Invalid EventTimeOfDay values provided.");
  }

  return timeOrder.slice(
    Math.min(startIndex, endIndex),
    Math.max(startIndex, endIndex) + 1
  );
};

const getDestinationsString = (destinations: string[]): string => {
  let output = "";
  destinations.map((destination, index) => {
    output += destination;

    if (index < destinations.length - 2) {
      output += ", ";
    } else if (index === destinations.length - 2) {
      output += " and ";
    }
  });
  return output;
};

export const getItinerarySummaryText = (itinerary: IItinerary): string => {
  const numDays = itinerary.itinerary.length;
  const destinations =
    itinerary.request.payload.user_requested_destinations.map(
      (userRequestedDestination) => userRequestedDestination.name
    );
  return `${numDays} ${numDays > 1 ? "days" : "day"} ${numDays} ${numDays > 1 ? "nights" : "night"} to ${getDestinationsString(destinations)}`;
};

export const getPreviousEvent = (
  indexOfEvent: number,
  events: Event[]
): Event | null => {
  if (indexOfEvent === 0) return null;

  return events[indexOfEvent - 1];
};

export const getNextEvent = (
  indexOfEvent: number,
  events: Event[]
): Event | null => {
  if (indexOfEvent === events.length) return null;

  return events[indexOfEvent];
};

export const getTimeOfDayOptions = (
  indexOfEvent: number,
  events: Event[],
  isModifyEvent: boolean
): EventTimeOfDay[] => {
  const previousEvent: Event | null = getPreviousEvent(indexOfEvent, events);
  const nextEvent: Event | null = isModifyEvent
    ? getNextEvent(indexOfEvent + 1, events)
    : getNextEvent(indexOfEvent, events);
  let options: EventTimeOfDay[] = [];
  let previousEventTimeOfDay: EventTimeOfDay;
  let nextEventTimeOfDay: EventTimeOfDay;

  if (!previousEvent && nextEvent) {
    // if no previous event, means this new event will be the first one in the updated itineray. allow any time of day before and during the same time of day as the next event
    nextEventTimeOfDay = nextEvent.time_of_day;
    options = getTimesOfDayBefore(nextEventTimeOfDay);
  } else if (previousEvent && !nextEvent) {
    // if no next event, means this new event will be the last one in the updated itinerary. allow any time of day during and after the same time of day as the previous event
    previousEventTimeOfDay = previousEvent.time_of_day;
    options = getTimesOfDayAfter(previousEventTimeOfDay);
  } else if (!previousEvent && !nextEvent) {
    // if no previous and next events, means this new event will be the only one in the updated itinerary. allow any time of day
    options = Object.values(EventTimeOfDay);
  } else {
    // if there are both previous and next events, means this event will be sandwiched between existing events. allow any time of day during and after the previous time of day as the previous event, and during and before the time of day as the next event
    previousEventTimeOfDay = previousEvent?.time_of_day!;
    nextEventTimeOfDay = nextEvent?.time_of_day!;
    options = getTimesOfDayBetween(previousEventTimeOfDay, nextEventTimeOfDay);
  }

  return options;
};

export const getIndexToMoveModifiedEventTo = (
  modifiedEvent: Event,
  events: Event[]
): number => {
  const newEventTimeOfDay = modifiedEvent.time_of_day;
  const indexToMoveModifiedEventTo = events.findIndex(
    (event: Event) => event.time_of_day === newEventTimeOfDay
  );

  if (indexToMoveModifiedEventTo === -1) {
    // if there are no existing events at the new time of day in the day plan of the itinerary
    if (newEventTimeOfDay === EventTimeOfDay.morning) {
      // if there are no existing morning events, the modified event is going to be the first event of the day plan
      return 0;
    } else if (newEventTimeOfDay === EventTimeOfDay.afternoon) {
      // if there are no existing afternoon events
      const hasMorningEvents = events.some(
        (event: Event) => event.time_of_day === EventTimeOfDay.morning
      );

      if (hasMorningEvents) {
        // if there are morning events, ensure the modified event comes after the last morning event
        return (
          events.findLastIndex(
            (event: Event) => event.time_of_day === EventTimeOfDay.morning
          ) + 1
        );
      } else {
        // if there are no morning events, then the modified event is going to be the first event of the day plan
        return 0;
      }
    } else {
      // if there are no existing event events, the modified event is going to be the last event of the day plan
      return events.length;
    }
  } else {
    return indexToMoveModifiedEventTo;
  }
};

export const getDateOfDayPlan = (
  itinerary: IItinerary,
  dayPlan: DayPlan
): Date => {
  const itineraryStartDate = dayjs(itinerary.request.payload.start_date);
  return itineraryStartDate.add(dayPlan.day - 1, "day").toDate();
};

export const getItinerarySpendingsBreakdown = (
  itinerary: IItinerary
): ItinerarySpendingsBreakdown => {
  const itinerarySpendingsBreakdown: ItinerarySpendingsBreakdown = [];

  itinerary.itinerary.forEach((dayPlan: DayPlan) => {
    const daySpendingsBreakdown: DaySpendingsBreakdown = {
      date: getDateOfDayPlan(itinerary, dayPlan),
      spendingsBreakdown: [],
    };

    dayPlan.events.forEach((event: Event) => {
      const eventSpending: EventSpending = {
        name: event.event_name,
        price: event.price ?? 0,
        spendingCategory: event.spending_category,
      };
      daySpendingsBreakdown.spendingsBreakdown.push(eventSpending);
    });

    itinerarySpendingsBreakdown.push(daySpendingsBreakdown);
  });

  return itinerarySpendingsBreakdown;
};

// for testing and debugging purposes
export const addMockSpendingsData = (itinerary: IItinerary): IItinerary => {
  const maxPrice = 500;
  const spendingCategories = [
    SpendingCategory.accommodation,
    SpendingCategory.attraction,
    SpendingCategory.food,
    SpendingCategory.general,
    SpendingCategory.transport,
  ];
  itinerary.itinerary.forEach((dayPlan: DayPlan) => {
    dayPlan.events.forEach((event: Event) => {
      event.price = Math.floor(Math.random() * maxPrice);
      event.spending_category =
        spendingCategories[
          Math.floor(Math.random() * spendingCategories.length)
        ];
    });
  });

  return itinerary;
};
