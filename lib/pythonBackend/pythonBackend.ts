import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import { PythonBackendEndpoints } from "./endpoints";
import { GenerateItineraryJSON } from "./types";

export const runPipeline = async (itineraryJson: GenerateItineraryJSON) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.runPipeline}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryJson),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const pipeline = await response.json();
    return {
      ...pipeline,
      request: itineraryJson,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const generateItinerary = async (
  itineraryJson: GenerateItineraryJSON,
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.generateItinerary}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryJson),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const validatePlan = async (itineraryJson: GenerateItineraryJSON) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.validatePlan}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryJson),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const searchHotels = async (itineraryJson: GenerateItineraryJSON) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.searchHotels}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryJson),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const searchFlights = async (itineraryJson: GenerateItineraryJSON) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.searchFlights}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryJson),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const generateItineraryJson = (
  itineraryForm: GenerateItineraryFormData,
): GenerateItineraryJSON => {
  const userRequestedDestinations = itineraryForm.userRequestedDestinations.map(
    (destination: UserRequestedDestination) => ({
      name: destination.name,
      start_date: destination.startDate.format("YYYY-MM-DD"),
      end_date: destination.endDate.format("YYYY-MM-DD"),
    }),
  );
  const otherRequirements = {
    pet_friendly: itineraryForm.otherRequirements.petFriendly,
    family_friendly: itineraryForm.otherRequirements.familyFriendly,
    more_sustainable: itineraryForm.otherRequirements.moreSustainable,
  };
  return {
    use_dummy_data: false,
    payload: {
      start_date: itineraryForm.startDate.format("YYYY-MM-DD"),
      end_date: itineraryForm.endDate.format("YYYY-MM-DD"),
      origin_country: itineraryForm.originCountry,
      user_requested_destinations: userRequestedDestinations,
      budget: itineraryForm.budget,
      total_hotel_rooms: itineraryForm.totalHotelRooms,
      num_people_travelling: {
        adults: itineraryForm.numPeopleTravelling.adults,
        children: itineraryForm.numPeopleTravelling.children,
      },
      focus: itineraryForm.focus,
      preferred_transport: itineraryForm.preferredTransport,
      other_requirements: otherRequirements,
      localisation: {
        country: itineraryForm.localisation.country,
        language: itineraryForm.localisation.language,
        currency: itineraryForm.localisation.currency,
      },
    },
  };
};
