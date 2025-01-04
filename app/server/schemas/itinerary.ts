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
