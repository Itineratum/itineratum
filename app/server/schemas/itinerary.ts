import { z } from "zod";

export const saveItinerarySchema = {
  input: z.object({
    email: z.string().nullable(),
    itinerary: z.any(),
    hotels: z.any(),
    flights: z.any(),
  }),
  output: z.string(),
};
