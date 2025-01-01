import { Currency } from "@/constants/enums/currency";
import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { Language } from "@/constants/enums/language";
import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";

export interface GenerateItineraryJSON {
  use_dummy_data: boolean;
  payload: {
    start_date: string;
    end_date: string;
    origin_country: string;
    user_requested_destinations: {
      name: string;
      start_date: string;
      end_date: string;
    }[];
    budget: number;
    total_hotel_rooms: number;
    num_people_travelling: {
      adults: number;
      children: number;
    };
    focus: {
      attraction: number;
      localCuisine: number;
      nature: number;
      shopping: number;
    };
    preferred_transport: GenerateItineraryPreferredTransport;
    other_requirements: {
      pet_friendly: boolean;
      family_friendly: boolean;
      more_sustainable: boolean;
    };
    localisation: {
      country: string;
      language: keyof typeof Language;
      currency: keyof typeof Currency;
    };
  };
}
