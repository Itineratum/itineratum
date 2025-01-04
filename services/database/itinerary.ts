import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import Itinerary from "@/models/Itinerary";

export const saveItinerary = async (
  email: string | null,
  request: any,
  itinerary: any,
  hotels: any,
  flights: any,
) => {
  try {
    await connectToDatabase();
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
