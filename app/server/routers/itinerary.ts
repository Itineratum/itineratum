import { DayPlan, Hotel } from "@/lib/pythonBackend/types";
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

const formatItinerary = (itineraryRaw: any): DayPlan[] => {
  const itinerary: DayPlan[] = [];
  itineraryRaw = itineraryRaw.filter(
    (destinationPlan: any) =>
      destinationPlan.plan && destinationPlan.plan.length > 0,
  );
  itineraryRaw.forEach((destinationPlan: any) => {
    const days = getDays(destinationPlan.day);
    const destination = destinationPlan.location;
    destinationPlan.plan.forEach((rawDayPlan: any, index: number) => {
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
  return itinerary;
};

const formatHotels = (hotelsRaw: any): Hotel[][] => {
  const hotels: Hotel[][] = [];
  hotelsRaw.forEach((destinationHotelsRaw: any[]) => {
    const destinationHotels: Hotel[] = [];
    destinationHotelsRaw.forEach((hotelRaw: any) => {
      const hotel: Hotel = {
        type: hotelRaw.type,
        name: hotelRaw.name,
        description: hotelRaw.description,
        url: hotelRaw.link,
        coordinates: {
          latitude: hotelRaw.gps_coordinates.latitude,
          longitude: hotelRaw.gps_coordinates.longitude,
        },
        check_in_time: hotelRaw.check_in_time,
        check_out_time: hotelRaw.check_out_time,
        rate_per_night: hotelRaw.rate_per_night.extracted_lowest,
        hotel_class: hotelRaw.extracted_hotel_class,
        images: hotelRaw.images.map((image: any) => image.original_image),
        rating: hotelRaw.overall_rating,
        num_reviews: hotelRaw.reviews,
        location_rating: hotelRaw.location_rating,
        amenities: hotelRaw.amenities,
      };
      destinationHotels.push(hotel);
    });
    hotels.push(destinationHotels);
  });
  return hotels;
};

export const itineraryRouter = router({
  saveItinerary: publicProcedure
    .input(saveItinerarySchema.input)
    .output(saveItinerarySchema.output)
    .mutation(async (data) => {
      const email = data.input.email;
      const request = data.input.request;
      const flights = data.input.flights;

      const itineraryRaw = data.input.itinerary;
      const itinerary: DayPlan[] = formatItinerary(itineraryRaw);
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
  updateItinerary: publicProcedure
    .input(updateItinerarySchema.input)
    .output(updateItinerarySchema.output)
    .mutation(async (data) => {
      const itineraryId = data.input.itineraryId;
      const request = data.input.request;
      const flights = data.input.flights;

      const itineraryRaw = data.input.itinerary;
      const itinerary: DayPlan[] = formatItinerary(itineraryRaw);
      const hotelsRaw = data.input.hotels;
      const hotels: Hotel[][] = formatHotels(hotelsRaw);

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
