import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import { Dispatch, SetStateAction } from "react";
import { backupRunPipelineWithGenerationStepsJson } from "./backupRunPipelineWithGenerationStepsJson";
import { PythonBackendEndpoints } from "./endpoints";
import {
  AdditionalActivity,
  DayPlan,
  EventTimeOfDay,
  GenerateItineraryJSON,
  SearchActivityJSON,
  ValidateEditJSON,
  ValidateNewJSON,
} from "./types";
import dayjs from "dayjs";
import { time } from "console";

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

export const runPipelineWithGenerationSteps = async (
  itineraryJson: GenerateItineraryJSON,
  setGenerationStep: Dispatch<SetStateAction<GenerateItineraryStep>>,
) => {
  try {
    // validate the plan
    setGenerationStep(GenerateItineraryStep.validating);
    const validatePlanRes = await validatePlan(itineraryJson);

    if (
      validatePlanRes.plan_is_valid ||
      validatePlanRes.plan_is_valid === "yes"
    ) {
      setGenerationStep(GenerateItineraryStep.searchingHotels);
    } else {
      throw new Error(validatePlanRes.invalid_reason);
    }

    // search for hotels
    const searchHotelsRes = await searchHotels(itineraryJson);

    if (searchHotelsRes) {
      setGenerationStep(GenerateItineraryStep.searchingFlights);
    } else {
      throw new Error("Error finding hotels");
    }

    // search for flights
    const searchFlightsRes = await searchFlights(itineraryJson);

    // if (searchFlightsRes) setGenerationStep(GenerateItineraryStep.generatingItinerary);
    setGenerationStep(GenerateItineraryStep.generatingItinerary);

    // generate detailed itinerary
    const generateItineraryRes = await generateItinerary(itineraryJson);
    setGenerationStep(GenerateItineraryStep.generationComplete);

    return {
      itinerary: generateItineraryRes,
      hotels: searchHotelsRes,
      flights: searchFlightsRes,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const debugRunPipelineWithGenerationSteps = async (
  itineraryJson: GenerateItineraryJSON,
  setGenerationStep: Dispatch<SetStateAction<GenerateItineraryStep>>,
) => {
  const timeoutDurations = [
    3000, // validate plan
    3000, // search hotels
    3000, // search flights
    20000, // generate itinerary
  ];

  try {
    // validate the plan
    setGenerationStep(GenerateItineraryStep.validating);
    const validatePlanRes = {
      plan_is_valid: "yes",
      invalid_reason: "invalid",
    };
    await new Promise((f) => setTimeout(f, timeoutDurations[0]));

    if (
      validatePlanRes.plan_is_valid ||
      validatePlanRes.plan_is_valid === "yes"
    ) {
      setGenerationStep(GenerateItineraryStep.searchingHotels);
    } else {
      throw new Error(validatePlanRes.invalid_reason);
    }

    // search for hotels
    // const searchHotelsRes = await searchHotels(itineraryJson);
    const searchHotelsRes = backupRunPipelineWithGenerationStepsJson.hotels;
    await new Promise((f) => setTimeout(f, timeoutDurations[1]));

    if (searchHotelsRes) {
      setGenerationStep(GenerateItineraryStep.searchingFlights);
    } else {
      throw new Error("Error finding hotels");
    }

    // search for flights
    // const searchFlightsRes = await searchFlights(itineraryJson);
    const searchFlightsRes = backupRunPipelineWithGenerationStepsJson.flights;
    await new Promise((f) => setTimeout(f, timeoutDurations[2]));

    // if (searchFlightsRes) setGenerationStep(GenerateItineraryStep.generatingItinerary);
    setGenerationStep(GenerateItineraryStep.generatingItinerary);

    // generate detailed itinerary
    // const generateItineraryRes = await generateItinerary(itineraryJson);
    const generateItineraryRes =
      backupRunPipelineWithGenerationStepsJson.itinerary;
    await new Promise((f) => setTimeout(f, timeoutDurations[3]));
    setGenerationStep(GenerateItineraryStep.generationComplete);

    return {
      itinerary: generateItineraryRes,
      hotels: searchHotelsRes,
      flights: searchFlightsRes,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const validateNew = async (validateNewJson: ValidateNewJSON) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.validateNew}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validateNewJson),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok!");
    }

    const res = await response.json();

    console.log("RES", res);

    const output = {
      success: false,
      reason: "",
    };

    if (res.plan_is_valid && res.plan_is_valid === "yes") {
      output.success = true;
    } else if (res.plan_is_valid === "no") {
      output.reason = res.invalid_reason;
    }

    return output;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const validateEdit = async (validateEditJson: ValidateEditJSON) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.validateEdit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validateEditJson),
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

export const searchActivity = async (
  searchActivityJson: SearchActivityJSON,
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}${PythonBackendEndpoints.searchActivity}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchActivityJson),
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

export const generateValidateNewJson = (
  itineraryRequest: GenerateItineraryJSON,
  dayPlan: DayPlan,
  timeOfDay: EventTimeOfDay,
  locationName: string,
  locationCity: string,
): ValidateNewJSON => {
  const destination = dayPlan.destination;
  const destinationDayNum = dayPlan.day;
  const tripStartDate = dayjs(itineraryRequest.payload.start_date);
  const destinationDate =
    destinationDayNum === 1
      ? tripStartDate
      : tripStartDate.add(destinationDayNum - 1, "day");
  const morning = dayPlan.events
    .filter((event) => event.time_of_day === EventTimeOfDay.morning)
    .map((event) => event.event_name);
  const afternoon = dayPlan.events
    .filter((event) => event.time_of_day === EventTimeOfDay.afternoon)
    .map((event) => event.event_name);
  const evening = dayPlan.events
    .filter((event) => event.time_of_day === EventTimeOfDay.evening)
    .map((event) => event.event_name);
  const additionalActivity: AdditionalActivity = {
    time_period: timeOfDay,
    activity: `${locationName}, ${locationCity}`,
  };

  return {
    use_dummy_data: false,
    payload: {
      date: destinationDate.format("YYYY-MM-DD"),
      location: destination,
      itinerary: [{ morning, afternoon, evening }],
      additional_activities: [additionalActivity],
    },
  };
};

export const generateValidateEditJson = (
  itineraryRequest: GenerateItineraryJSON,
  dayPlan: DayPlan,
): ValidateEditJSON => {
  const destination = dayPlan.destination;
  const destinationDayNum = dayPlan.day;
  const tripStartDate = dayjs(itineraryRequest.payload.start_date);
  const destinationDate =
    destinationDayNum === 1
      ? tripStartDate
      : tripStartDate.add(destinationDayNum - 1, "day");
  const morning = dayPlan.events
    .filter((event) => event.time_of_day === EventTimeOfDay.morning)
    .map((event) => event.event_name);
  const afternoon = dayPlan.events
    .filter((event) => event.time_of_day === EventTimeOfDay.afternoon)
    .map((event) => event.event_name);
  const evening = dayPlan.events
    .filter((event) => event.time_of_day === EventTimeOfDay.evening)
    .map((event) => event.event_name);

  return {
    use_dummy_data: false,
    payload: {
      date: destinationDate.format("YYYY-MM-DD"),
      location: destination,
      itinerary: [{ morning, afternoon, evening }],
    },
  };
};

export const generateSearchActivityJson = (
  locationName: string,
  locationCity: string,
): SearchActivityJSON => {
  return {
    use_dummy_data: false,
    payload: {
      location_name: locationName,
      location_city: locationCity,
    },
  };
};
