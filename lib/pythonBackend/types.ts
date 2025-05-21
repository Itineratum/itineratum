import { Currency } from "@/constants/enums/currency";
import { GenerateItineraryPreferredTransport } from "@/constants/enums/generateItinerary";
import { Language } from "@/constants/enums/language";
import { SpendingCategory } from "@/constants/enums/spendingCategory";

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
  destination: string;
  events: Event[];
}

export interface Event {
  is_hotel: boolean; // indicates whether the current event is a hotel check in/check out event
  event_name: string;
  time_of_day: EventTimeOfDay;
  location_name: string;
  location_address: string;
  coordinates: Position | null;
  description: string;
  rating: number;
  website_uri: string;
  photo: string; // to get this using Google Place Photo (New)
  openingHours: string[];
  checkInTime: string | null;
  checkOutTime: string | null;
  price: number | null;
  spending_category: SpendingCategory;
}

export enum EventTimeOfDay {
  morning = "Morning",
  afternoon = "Afternoon",
  evening = "Evening",
}

export interface Position {
  lat: number;
  lng: number;
}

export interface TravelTime {
  duration: string;
  distance: string;
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

export interface ValidateNewJSON {
  use_dummy_data: boolean;
  payload: {
    date: string;
    location: string;
    itinerary: {
      morning: string[];
      afternoon: string[];
      evening: string[];
    };
    additional_activity: AdditionalActivity;
  };
}

export interface AdditionalActivity {
  time_period: EventTimeOfDay;
  activity: string;
}

export interface ValidateEditJSON {
  use_dummy_data: boolean;
  payload: {
    date: string;
    location: string;
    itinerary: {
      morning: string[];
      afternoon: string[];
      evening: string[];
    };
  };
}

export interface SearchActivityJSON {
  use_dummy_data: boolean;
  payload: {
    location_name: string;
    location_city: string;
  };
}
