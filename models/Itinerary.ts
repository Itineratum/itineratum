import { IItinerary } from "@/constants/types/itinerary";
import mongoose, { models, Schema } from "mongoose";
import constDbCollections from "@/constants/dbCollections.json";

const itinerarySchema = new Schema<IItinerary>(
  {
    generated_by: { type: String, required: false },
    generated_at: { type: Date, required: true },
    request: { type: Object, required: true },
    itinerary: { type: [Object], required: true },
    // travel_times: { type: [Object], required: true },
    selected_hotels: { type: [Object], required: true },
    hotels: { type: [Object], required: true },
    flights: { type: [Object], required: true },
  },
  { collection: constDbCollections.itineraries },
);

export default models.Itinerary || mongoose.model("Itinerary", itinerarySchema);
