import {
  DayPlan,
  GenerateItineraryJSON,
  Hotel
} from "@/lib/pythonBackend/types";

export interface IItinerary {
  generated_by: String;
  generated_at: Date;
  request: GenerateItineraryJSON;
  itinerary: DayPlan[];
  // travel_times: TravelTime[][]; // cannot cache the travel times from distance matrix API according to Google policy
  selected_hotels: Hotel[];
  hotels: Hotel[][];
  flights: any[];
}
