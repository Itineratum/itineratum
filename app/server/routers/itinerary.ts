import { EventCardTimeOfDay } from "@/app/[locale]/itinerary/components/event-card";
import { DayPlan, Event, Hotel } from "@/lib/pythonBackend/types";
import {
  clearHotelEvents,
  formatHotels,
  formatItinerary,
  getHotelLocationAddress,
  getTimeOfDay,
  noHotelEvents,
} from "@/lib/pythonBackend/utils";
import {
  adjustItineraryBudget,
  adjustItineraryHotels,
  retrieveItinerary,
  saveItinerary,
} from "@/services/database/itinerary";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  adjustItineraryBudgetSchema,
  adjustItineraryHotelsSchema,
  getItinerarySchema,
  saveItinerarySchema,
} from "../schemas/itinerary";
import { publicProcedure, router } from "../trpc";

dayjs.extend(utc);

export const itineraryRouter = router({
  saveItinerary: publicProcedure
    .input(saveItinerarySchema.input)
    .output(saveItinerarySchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const request = data.input.request;
      const flights = data.input.flights;

      const itineraryRaw = data.input.itinerary;
      const itinerary: DayPlan[] = await formatItinerary(itineraryRaw);
      const hotelsRaw = data.input.hotels;
      const hotels: Hotel[][] = formatHotels(hotelsRaw);

      const saveItineraryRes = await saveItinerary(
        email,
        request,
        itinerary,
        hotels,
        flights,
      );
      return saveItineraryRes.itineraryId;
    }),
  getItinerary: publicProcedure
    .input(getItinerarySchema.input)
    .output(getItinerarySchema.output)
    .query(async (data) => {
      const itineraryId = data.input.itineraryId;
      const retrieveItineraryRes = await retrieveItinerary(itineraryId);

      if (!retrieveItineraryRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: retrieveItineraryRes?.error!,
        });
      }

      return retrieveItineraryRes.data;
    }),
  adjustItineraryBudget: publicProcedure
    .input(adjustItineraryBudgetSchema.input)
    .output(adjustItineraryBudgetSchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const request = data.input.request;
      const flights = data.input.flights;

      const itineraryRaw = data.input.itinerary;
      const itinerary: DayPlan[] = await formatItinerary(itineraryRaw);
      const hotelsRaw = data.input.hotels;
      const hotels: Hotel[][] = formatHotels(hotelsRaw);

      const adjustItineraryBudgetRes = await adjustItineraryBudget(
        itineraryId,
        request,
        itinerary,
        hotels,
        flights,
      );

      if (!adjustItineraryBudgetRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: adjustItineraryBudgetRes?.error!,
        });
      }
    }),
  adjustItineraryHotels: publicProcedure
    .input(adjustItineraryHotelsSchema.input)
    .output(adjustItineraryHotelsSchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const retrieveItineraryRes = await retrieveItinerary(itineraryId);
      let itinerary = retrieveItineraryRes.data.itinerary;
      const userRequestedDestinations =
        retrieveItineraryRes.data.request.payload.user_requested_destinations;
      const tripStartDate = dayjs(
        retrieveItineraryRes.data.request.payload.start_date,
      ).utc(true);
      const tripEndDate = dayjs(
        retrieveItineraryRes.data.request.payload.end_date,
      ).utc(true);
      const selectedHotels = data.input.selectedHotels;
      const tripCheckInCheckOutDays: number[][] = [];

      for (const userRequestedDestination of userRequestedDestinations) {
        const destinationCheckInCheckOutDays: number[] = [];
        const destinationStartDate = dayjs(
          userRequestedDestination.start_date,
        ).utc(true);
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
          location_name: "",
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
            } else if (
              hotelCheckInTimePeriod === EventCardTimeOfDay.afternoon
            ) {
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
            } else if (
              hotelCheckOutTimePeriod === EventCardTimeOfDay.afternoon
            ) {
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

      const adjustItineraryHotelsRes = await adjustItineraryHotels(
        itineraryId,
        itinerary,
      );

      if (!adjustItineraryHotelsRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: adjustItineraryHotelsRes?.error!,
        });
      }
    }),
});
