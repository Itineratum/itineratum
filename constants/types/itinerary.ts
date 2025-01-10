import {
  DayPlan,
  GenerateItineraryJSON,
  Hotel,
} from "@/lib/pythonBackend/types";

export interface IItinerary {
  generated_by: String;
  generated_at: Date;
  request: GenerateItineraryJSON;
  itinerary: DayPlan[];
  selected_hotels: Hotel[];
  hotels: Hotel[][];
  flights: any[];
}
