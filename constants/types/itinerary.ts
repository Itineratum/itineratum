import { DayPlan, GenerateItineraryJSON } from "@/lib/pythonBackend/types";

export interface IItinerary {
  generated_by: String;
  generated_at: Date;
  request: GenerateItineraryJSON;
  itinerary: DayPlan[];
  hotels: any[];
  flights: any[];
}
