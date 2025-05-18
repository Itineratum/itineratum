import {
  DeleteEventFromItineraryDetails,
  ItineraryEditAction,
  ItineraryEditDetails,
} from "@/app/[locale]/itinerary/components/review-itinerary/review-itinerary";
import { sendItinerary } from "@/lib/nodeMailer";
import { DayPlan, Event, Hotel, TravelTime } from "@/lib/pythonBackend/types";
import {
  adjustItineraryWithSelectedHotels,
  deleteCorrespondingHotelEvents,
  formatHotels,
  formatItinerary,
  getTravelTimes,
  getTripCheckInCheckOutDays,
  hasHotelDeletes,
} from "@/lib/pythonBackend/utils";
import {
  adjustItineraryBudget,
  adjustItineraryHotels,
  retrieveItinerary,
  saveItinerary,
  updateItinerary,
  updateItineraryGeneratedBy,
} from "@/services/database/itinerary";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  adjustItineraryBudgetSchema,
  adjustItineraryHotelsSchema,
  editItinerarySchema,
  emailItinerarySchema,
  getItinerarySchema,
  saveItinerarySchema,
  updateItineraryGeneratedBySchema,
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
      const travelTimes: TravelTime[][] = await getTravelTimes(itinerary);
      const hotelsRaw = data.input.hotels;
      const hotels: Hotel[][] = formatHotels(hotelsRaw);
      const saveItineraryRes = await saveItinerary(
        email,
        request,
        itinerary,
        travelTimes,
        hotels,
        flights,
      );
      const itineraryId = saveItineraryRes.itineraryId;
      return itineraryId;
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

      if (
        retrieveItineraryRes.data &&
        retrieveItineraryRes.data.itinerary.length > 0
      ) {
        return retrieveItineraryRes.data;
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Itinerary not found",
        });
      }
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
      const travelTimes: TravelTime[][] = await getTravelTimes(itinerary);
      const hotelsRaw = data.input.hotels;
      const hotels: Hotel[][] = formatHotels(hotelsRaw);
      const adjustItineraryBudgetRes = await adjustItineraryBudget(
        itineraryId,
        request,
        itinerary,
        travelTimes,
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
      let itinerary: DayPlan[] = retrieveItineraryRes.data.itinerary;
      const userRequestedDestinations =
        retrieveItineraryRes.data.request.payload.user_requested_destinations;
      const tripStartDate = dayjs(
        retrieveItineraryRes.data.request.payload.start_date,
      ).utc(true);
      const tripEndDate = dayjs(
        retrieveItineraryRes.data.request.payload.end_date,
      ).utc(true);
      const selectedHotels = data.input.selectedHotels;
      const tripCheckInCheckOutDays: number[][] = getTripCheckInCheckOutDays(
        userRequestedDestinations,
        tripStartDate,
        tripEndDate,
      );
      await adjustItineraryWithSelectedHotels(
        selectedHotels,
        tripCheckInCheckOutDays,
        itinerary,
      );
      const travelTimes: TravelTime[][] = await getTravelTimes(itinerary);
      const adjustItineraryHotelsRes = await adjustItineraryHotels(
        itineraryId,
        itinerary,
        selectedHotels,
        travelTimes,
      );

      if (!adjustItineraryHotelsRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: adjustItineraryHotelsRes?.error!,
        });
      }
    }),
  editItinerary: publicProcedure
    .input(editItinerarySchema.input)
    .output(editItinerarySchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const retrieveItineraryRes = await retrieveItinerary(itineraryId);
      const itinerary: DayPlan[] = retrieveItineraryRes.data.itinerary;
      const dayNum = data.input.dayNum;
      const newEvents = data.input.newEvents;
      itinerary[dayNum - 1].events = newEvents;
      const travelTimes: TravelTime[][] = await getTravelTimes(itinerary);
      let selectedHotels = retrieveItineraryRes.data.selected_hotels;
      const edits: Partial<
        Record<ItineraryEditAction, ItineraryEditDetails>
      >[] = data.input.edits;
      const eventsToDelete: Event[] = edits
        .filter((edit) => edit.delete)
        .map((edit) => (edit.delete as DeleteEventFromItineraryDetails).event);

      if (eventsToDelete && eventsToDelete.length > 0) {
        if (hasHotelDeletes(eventsToDelete)) {
          // if there are events where a hotel check in/out is delete, delete the corresponding hotel check out/in event as well
          selectedHotels = deleteCorrespondingHotelEvents(
            eventsToDelete,
            retrieveItineraryRes.data.request,
            selectedHotels,
            itinerary,
          );
        }
      }

      const updateItineraryRes = await updateItinerary(
        itineraryId,
        itinerary,
        travelTimes,
        selectedHotels,
      );

      if (!updateItineraryRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateItineraryRes?.error!,
        });
      }
    }),
  emailItinerary: publicProcedure
    .input(emailItinerarySchema.input)
    .output(emailItinerarySchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const itineraryId = data.input.itineraryId;
      const name = data.input.name;
      await sendItinerary(email, name, itineraryId);
    }),
  updateItineraryGeneratedBy: publicProcedure
    .input(updateItineraryGeneratedBySchema.input)
    .output(updateItineraryGeneratedBySchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const itineraryId = data.input.itineraryId;
      const updateItineraryGeneratedByRes = await updateItineraryGeneratedBy(
        itineraryId,
        email,
      );

      if (!updateItineraryGeneratedByRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateItineraryGeneratedByRes?.error!,
        });
      }
    }),
});
