import { ObjectId } from "mongodb";

export interface IItinerary {
  generated_by: String;
  generated_at: Date;
  itinerary: Object;
  hotels: Object;
  flights: Object;
}
