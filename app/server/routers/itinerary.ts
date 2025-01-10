import { DayPlan, Hotel } from "@/lib/pythonBackend/types";
import {
  adjustItineraryWithSelectedHotels,
  formatHotels,
  formatItinerary,
  getTripCheckInCheckOutDays,
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
        flights
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
        flights
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
        retrieveItineraryRes.data.request.payload.start_date
      ).utc(true);
      const tripEndDate = dayjs(
        retrieveItineraryRes.data.request.payload.end_date
      ).utc(true);
      const selectedHotels = data.input.selectedHotels;
      const tripCheckInCheckOutDays: number[][] = getTripCheckInCheckOutDays(
        userRequestedDestinations,
        tripStartDate,
        tripEndDate
      );
      adjustItineraryWithSelectedHotels(
        selectedHotels,
        tripCheckInCheckOutDays,
        itinerary
      );

      const adjustItineraryHotelsRes = await adjustItineraryHotels(
        itineraryId,
        itinerary
      );

      if (!adjustItineraryHotelsRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: adjustItineraryHotelsRes?.error!,
        });
      }
    }),
});
