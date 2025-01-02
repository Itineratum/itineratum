import { IItinerary } from "@/constants/types/itinerary";
import mongoose, { models, Schema } from "mongoose";

const itinerarySchema = new Schema<IItinerary>({
  id: { type: Schema.Types.ObjectId, required: true },
  created_at: { type: Date, required: true },
  itinerary: { type: Object, required: true },
  hotels: { type: Object, required: true },
  flights: { type: Object, required: true },
});

export default models.Itinerary || mongoose.model("Itinerary", itinerarySchema);
