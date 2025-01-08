import { DayPlan } from "@/lib/pythonBackend/types";
import { getTimePeriodPlan } from "@/lib/pythonBackend/utils";
import {
  retrieveItinerary,
  saveItinerary,
  updateItinerary,
} from "@/services/database/itinerary";
import { getDays } from "@/utils/itinerary";
import { TRPCError } from "@trpc/server";
import {
  getItinerarySchema,
  saveItinerarySchema,
  updateItinerarySchema,
} from "../schemas/itinerary";
import { publicProcedure, router } from "../trpc";

export const itineraryRouter = router({
  saveItinerary: publicProcedure
    .input(saveItinerarySchema.input)
    .output(saveItinerarySchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const request = data.input.request;
      const hotels = data.input.hotels;
      const flights = data.input.flights;

      let itineraryRaw = data.input.itinerary;
      const itinerary: DayPlan[] = [];
      itineraryRaw = itineraryRaw.filter(
        (destinationPlan: any) =>
          destinationPlan.plan && destinationPlan.plan.length > 0,
      );

      itineraryRaw.map((destinationPlan: any) => {
        const days = getDays(destinationPlan.day);
        const destination = destinationPlan.location;
        destinationPlan.plan.map((rawDayPlan: any, index: number) => {
          const dayPlan: DayPlan = {
            destination,
            day: days[index],
            morning: getTimePeriodPlan(rawDayPlan.morning),
            afternoon: getTimePeriodPlan(rawDayPlan.afternoon),
            evening: getTimePeriodPlan(rawDayPlan.evening),
          };
          itinerary.push(dayPlan);
        });
      });

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
  updateItinerary: publicProcedure
    .input(updateItinerarySchema.input)
    .output(updateItinerarySchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const request = data.input.request;
      const hotels = data.input.hotels;
      const flights = data.input.flights;

      let itineraryRaw = data.input.itinerary;
      const itinerary: DayPlan[] = [];
      itineraryRaw = itineraryRaw.filter(
        (destinationPlan: any) =>
          destinationPlan.plan && destinationPlan.plan.length > 0,
      );

      itineraryRaw.map((destinationPlan: any) => {
        const days = getDays(destinationPlan.day);
        const destination = destinationPlan.location;
        destinationPlan.plan.map((rawDayPlan: any, index: number) => {
          const dayPlan: DayPlan = {
            destination,
            day: days[index],
            morning: getTimePeriodPlan(rawDayPlan.morning),
            afternoon: getTimePeriodPlan(rawDayPlan.afternoon),
            evening: getTimePeriodPlan(rawDayPlan.evening),
          };
          itinerary.push(dayPlan);
        });
      });

      const updateItineraryRes = await updateItinerary(
        itineraryId,
        request,
        itinerary,
        hotels,
        flights,
      );

      if (!updateItineraryRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateItineraryRes?.error!,
        });
      }
    }),
});
