import { GenerateItineraryJSON } from "@/lib/pythonBackend/types";

export interface IItinerary {
  generated_by: String;
  generated_at: Date;
  request: GenerateItineraryJSON;
  itinerary: any[];
  hotels: any[];
  flights: any[];
}
