import { Currency } from "@/constants/enums/currency";
import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { Language } from "@/constants/enums/language";
import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { ObjectId } from "mongodb";

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

export interface DayPlan {
  day: number;
  morning: Event[];
  afternoon: Event[];
  evening: Event[];
  destination: string;
}

export interface Event {
  event_name: string;
  location_name: string;
  location_address: string;
  description: string;
  rating: number;
  website_uri: string;
  // price_range: PriceRange;
  photo: string; // to get this using Google Place Photo (New)
  openingHours: string[];
}

export interface PriceRange {
  startPrice: Price;
  endPrice: Price;
}

export interface Price {
  currencyCode: string;
  units: string;
}
