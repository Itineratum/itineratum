import { DayPlan, Event } from "@/lib/pythonBackend/types";
import {
  retrieveItinerary,
  saveItinerary,
} from "@/services/database/itinerary";
import { getDays } from "@/utils/itinerary";
import { TRPCError } from "@trpc/server";
import { getItinerarySchema, saveItinerarySchema } from "../schemas/itinerary";
import { publicProcedure, router } from "../trpc";
import { getTimePeriodPlan } from "@/lib/pythonBackend/utils";

export const itineraryRouter = router({
  saveItinerary: publicProcedure
    .input(saveItinerarySchema.input)
    .output(saveItinerarySchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const request = data.input.request;
      const hotels = data.input.hotels;
      const flights = data.input.flights;

      const itineraryRaw = data.input.itinerary;
      const itinerary: DayPlan[] = [];
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
});
