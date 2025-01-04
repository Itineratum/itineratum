import { GenerateItineraryJSON } from "@/lib/pythonBackend/types";

export interface IItinerary {
  generated_by: String;
  generated_at: Date;
  request: GenerateItineraryJSON;
  itinerary: Object;
  hotels: Object;
  flights: Object;
}
