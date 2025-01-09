import { Currency } from "@/constants/enums/currency";
import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { Language } from "@/constants/enums/language";

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

export interface Hotel {
  type: string;
  name: string;
  description: string;
  url: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  check_in_time: string;
  check_out_time: string;
  rate_per_night: number;
  hotel_class: number;
  images: string[];
  rating: number;
  num_reviews: number;
  location_rating: number;
  amenities: string[];
}

export enum HotelType {
  "vacation rental" = "Vacation Rental",
  hotel = "Hotel",
}

// from https://serpapi.com/google-hotels-amenities
export enum HotelAmenity {
  "Free parking" = "Free parking",
  "Parking" = "Parking",
  "Indoor pool" = "Indoor pool",
  "Outdoor pool" = "Outdoor pool",
  "Pool" = "Pool",
  "Fitness center" = "Fitness center",
  "Restaurant" = "Restaurant",
  "Free breakfast" = "Free breakfast",
  "Spa" = "Spa",
  "Beach access" = "Beach access",
  "Child-friendly" = "Child-friendly",
  "Bar" = "Bar",
  "Pet-friendly" = "Pet-friendly",
  "Room service" = "Room service",
  "Free Wi-Fi" = "Free Wi-Fi",
  "Air-conditioned" = "Air-conditioned",
  "All-inclusive available" = "All-inclusive available",
  "Wheelchair accessible" = "Wheelchair accessible",
  "EV charger" = "EV charger",
}

// from https://serpapi.com/google-hotels-vacation-rentals-amenities
export enum VacationRentalAmenity {
  "Hot tub" = "Hot tub",
  "Air-conditioned" = "Air-conditioned",
  "Outdoor grill" = "Outdoor grill",
  "Fireplace" = "Fireplace",
  "Patio or deck" = "Patio or deck",
  "Kitchen" = "Kitchen",
  "Fitness centre" = "Fitness centre",
  "Cot" = "Cot",
  "Beach access" = "Beach access",
  "Child-friendly" = "Child-friendly",
  "Pet-friendly" = "Pet-friendly",
  "Free Wi-Fi" = "Free Wi-Fi",
  "Pool" = "Pool",
}
