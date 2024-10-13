import constDbCollections from "@/constants/dbCollections.json";
import { IFAQ } from "@/constants/types/faq";
import mongoose, { models, Schema } from "mongoose";

const faqSchema = new Schema<IFAQ>(
  {
    index: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { collection: constDbCollections.faqs },
);

export default models.FAQ || mongoose.model("FAQ", faqSchema);
