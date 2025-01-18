import { z } from "zod";

export const saveItinerarySchema = {
  input: z.object({
    email: z.string().nullable(),
    request: z.any(),
    itinerary: z.any(),
    hotels: z.any(),
    flights: z.any(),
  }),
  output: z.string(),
};

export const getItinerarySchema = {
  input: z.object({ itineraryId: z.string() }),
  output: z.any(),
};

export const adjustItineraryBudgetSchema = {
  input: z.object({
    itineraryId: z.string(),
    request: z.any(),
    itinerary: z.any(),
    hotels: z.any(),
    flights: z.any(),
  }),
  output: z.void(),
};

export const adjustItineraryHotelsSchema = {
  input: z.object({
    itineraryId: z.string(),
    selectedHotels: z.any(),
  }),
  output: z.void(),
};

export const editItinerarySchema = {
  input: z.object({
    itineraryId: z.string(),
    dayNum: z.number(),
    newEvents: z.any(),
    edits: z.any(),
  }),
  output: z.void(),
};

export const emailItinerarySchema = {
  input: z.object({ email: z.string(), itineraryId: z.string() }),
  output: z.void(),
};

export const updateItineraryGeneratedBySchema = {
  input: z.object({ email: z.string(), itineraryId: z.string() }),
  output: z.void(),
};
