import { saveItinerary } from "@/services/database/itinerary";
import { saveItinerarySchema } from "../schemas/itinerary";
import { publicProcedure, router } from "../trpc";

export const itineraryRouter = router({
  saveItinerary: publicProcedure
    .input(saveItinerarySchema.input)
    .output(saveItinerarySchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const itinerary = data.input.itinerary;
      const hotels = data.input.hotels;
      const flights = data.input.flights;
      const saveItineraryRes = await saveItinerary(
        email,
        itinerary,
        hotels,
        flights,
      );
      return saveItineraryRes.itineraryId;
    }),
});
