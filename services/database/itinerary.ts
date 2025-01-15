import { connectToDatabase } from "@/lib/db";
import { DayPlan, Hotel, TravelTime } from "@/lib/pythonBackend/types";
import Itinerary from "@/models/Itinerary";
import { ObjectId } from "mongodb";

export const saveItinerary = async (
  email: string | null,
  request: any,
  itinerary: DayPlan[],
  travelTimes: TravelTime[][],
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
      travel_times: travelTimes,
      selected_hotels: Array(
        request.payload.user_requested_destinations.length,
      ).fill(null),
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

export const adjustItineraryBudget = async (
  itineraryId: string,
  request: any,
  itinerary: DayPlan[],
  travelTimes: TravelTime[][],
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
        travel_times: travelTimes,
        selected_hotels: [],
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
      return { success: false, error: "Itinerary budget adjustment failed" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const adjustItineraryHotels = async (
  itineraryId: string,
  itinerary: DayPlan[],
  selectedHotels: Hotel[],
  travelTimes: TravelTime[][],
) => {
  try {
    await connectToDatabase();
    const update = {
      $set: {
        itinerary,
        selected_hotels: selectedHotels,
        travel_times: travelTimes,
      },
    };
    const result = await Itinerary.updateOne(
      { _id: new ObjectId(itineraryId) },
      update,
    );

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Itinerary hotel adjustment failed" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const removeEventFromItinerary = async (
  itineraryId: string,
  itinerary: DayPlan[],
  travelTimes: TravelTime[][],
  selectedHotels: Hotel[],
) => {
  try {
    await connectToDatabase();
    const update = {
      $set: {
        itinerary,
        travel_times: travelTimes,
        selected_hotels: selectedHotels,
      },
    };
    const result = await Itinerary.updateOne(
      { _id: new ObjectId(itineraryId) },
      update,
    );

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Remove event from itinerary failed" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const insertEditEventInItinerary = async (
  itineraryId: string,
  dayNum: number,
  dayPlan: DayPlan,
) => {
  try {
    await connectToDatabase();
    const update = {
      $set: {
        [`itinerary[${dayNum - 1}]`]: dayPlan,
      },
    };
    const result = await Itinerary.updateOne(
      { _id: new ObjectId(itineraryId) },
      update,
    );

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Insert event to itinerary failed" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};
