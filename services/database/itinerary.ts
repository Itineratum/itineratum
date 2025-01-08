import { connectToDatabase } from "@/lib/db";
import { DayPlan } from "@/lib/pythonBackend/types";
import Itinerary from "@/models/Itinerary";
import { ObjectId } from "mongodb";

export const saveItinerary = async (
  email: string | null,
  request: any,
  itinerary: DayPlan[],
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
    // await disconnectFromDatabase();
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

export const updateItinerary = async (
  itineraryId: string,
  request: any,
  itinerary: DayPlan[],
  hotels: any,
  flights: any,
) => {
  try {
    await connectToDatabase();
    const update = {
      $set: {
        generated_at: new Date(),
        request,
        itinerary,
        hotels,
        flights,
      },
    };
    const result = await Itinerary.updateOne(
      { _id: new ObjectId(itineraryId) },
      update,
    );

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Itinerary update failed" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};
