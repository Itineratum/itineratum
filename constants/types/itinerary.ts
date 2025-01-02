import { ObjectId } from "mongodb";

export interface IItinerary {
  id: ObjectId;
  created_at: Date;
  itinerary: Object;
  hotels: Object;
  flights: Object;
}
