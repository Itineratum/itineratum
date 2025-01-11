import {
  DayPlan,
  GenerateItineraryJSON,
  Hotel,
  TravelTime,
} from "@/lib/pythonBackend/types";

export interface IItinerary {
  generated_by: String;
  generated_at: Date;
  request: GenerateItineraryJSON;
  itinerary: DayPlan[];
  travel_times: TravelTime[][];
  selected_hotels: Hotel[];
  hotels: Hotel[][];
  flights: any[];
}
