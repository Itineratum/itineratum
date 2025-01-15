import { ItineraryEditAction } from "@/components/templates/itinerary-page";
import {
  DayPlan,
  Event,
  EventTimeOfDay,
  Hotel,
  TravelTime,
} from "@/lib/pythonBackend/types";
import {
  adjustItineraryWithSelectedHotels,
  deleteCorrespondingHotelEvents,
  formatHotels,
  formatItinerary,
  getEvents,
  getTravelTimes,
  getTripCheckInCheckOutDays,
  hasHotelEdits,
} from "@/lib/pythonBackend/utils";
import {
  adjustItineraryBudget,
  adjustItineraryHotels,
  insertEditEventInItinerary,
  removeEventFromItinerary,
  retrieveItinerary,
  saveItinerary,
} from "@/services/database/itinerary";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  addEventToItinerarySchema,
  adjustItineraryBudgetSchema,
  adjustItineraryHotelsSchema,
  deleteEventFromItinerarySchema,
  getItinerarySchema,
  modifyEventInItinerarySchema,
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
  deleteEventFromItinerary: publicProcedure
    .input(deleteEventFromItinerarySchema.input)
    .output(deleteEventFromItinerarySchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const retrieveItineraryRes = await retrieveItinerary(itineraryId);
      const itinerary: DayPlan[] = retrieveItineraryRes.data.itinerary;
      const dayNum = data.input.dayNum;
      const newEvents = data.input.newEvents;
      const travelTimes: TravelTime[][] = await getTravelTimes(itinerary);
      const edits: Record<ItineraryEditAction, Event[]> = data.input.edits;
      const eventsToDelete: Event[] = edits.delete;
      itinerary[dayNum - 1].events = newEvents;
      let selectedHotels = retrieveItineraryRes.data.selected_hotels;

      if (hasHotelEdits(eventsToDelete)) {
        selectedHotels = deleteCorrespondingHotelEvents(
          eventsToDelete,
          retrieveItineraryRes.data.request,
          selectedHotels,
          itinerary,
        );
      }

      const editItineraryRes = await removeEventFromItinerary(
        itineraryId,
        itinerary,
        travelTimes,
        selectedHotels,
      );

      if (!editItineraryRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: editItineraryRes?.error!,
        });
      }
    }),
  addEventToItinerary: publicProcedure
    .input(addEventToItinerarySchema.input)
    .output(addEventToItinerarySchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const retrieveItineraryRes = await retrieveItinerary(itineraryId);
      const itinerary: DayPlan[] = retrieveItineraryRes.data.itinerary;
      const dayNum = data.input.dayNum;
      const dayPlan = itinerary.filter(
        (dayPlan: DayPlan) => dayPlan.day === dayNum,
      )[0];
      const indexToAddEventTo = data.input.indexToAddEventTo;
      const newEventDetails = data.input.newEventDetails;
      const newEventTimeOfDay = data.input.newEventTimeOfDay;
      const newEvent = await getEvents(
        [newEventDetails],
        newEventTimeOfDay as EventTimeOfDay,
      );
      dayPlan.events.splice(indexToAddEventTo, 0, newEvent[0]);
      const insertEditEventInItineraryRes = await insertEditEventInItinerary(
        itineraryId,
        dayNum,
        dayPlan,
      );

      if (!insertEditEventInItineraryRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: insertEditEventInItineraryRes?.error!,
        });
      }
    }),
  modifyEventInItinerary: publicProcedure
    .input(modifyEventInItinerarySchema.input)
    .output(modifyEventInItinerarySchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const retrieveItineraryRes = await retrieveItinerary(itineraryId);
      const itinerary: DayPlan[] = retrieveItineraryRes.data.itinerary;
      const dayNum = data.input.dayNum;
      const dayPlan = itinerary.filter(
        (dayPlan: DayPlan) => dayPlan.day === dayNum,
      )[0];
      const indexToModifyEventAt = data.input.indexToModifyEventAt;
      const modifiedEventDetails = data.input.modifiedEventDetails;
      const modifiedEventTimeOfDay = data.input.modifiedEventTimeOfDay;
      const modifiedEvent = await getEvents(
        [modifiedEventDetails],
        modifiedEventTimeOfDay as EventTimeOfDay,
      );
      dayPlan.events[indexToModifyEventAt] = modifiedEvent[0];
      const insertEditEventInItineraryRes = await insertEditEventInItinerary(
        itineraryId,
        dayNum,
        dayPlan,
      );

      if (!insertEditEventInItineraryRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: insertEditEventInItineraryRes?.error!,
        });
      }
    }),
});
