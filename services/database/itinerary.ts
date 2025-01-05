import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import Itinerary from "@/models/Itinerary";
import { getDays } from "@/utils/itinerary";

export const saveItinerary = async (
  email: string | null,
  request: any,
  itineraryRaw: any,
  hotels: any,
  flights: any,
) => {
  try {
    await connectToDatabase();
    const itinerary: any[] = [];

    itineraryRaw.map((locationItinerary: any) => {
      const days = getDays(locationItinerary.day);
      const city = locationItinerary.location;
      locationItinerary.plan.map((rawDayPlan: any, index: number) => {
        const dayPlan = {
          city,
          day: days[index],
          morning: rawDayPlan.morning,
          afternoon: rawDayPlan.afternoon,
          evening: rawDayPlan.evening,
        };
        itinerary.push(dayPlan);
      });
    });

    const itineraryDocument = {
      generated_by: "",
      generated_at: new Date(),
      request,
      itinerary,
      hotels,
      flights,
    };

    if (email) itineraryDocument.generated_by = email;

    const result = await Itinerary.create(itineraryDocument);

    return {
      success: true,
      itineraryId: result.id,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
};

export const retrieveItinerary = async (itineraryId: string) => {
  try {
    await connectToDatabase();
    const itinerary = await Itinerary.findById(itineraryId);

    if (itinerary) {
      return {
        success: true,
        data: itinerary,
      };
    } else {
      return {
        success: false,
        error: "Failed to retrieve Itinerary",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};
