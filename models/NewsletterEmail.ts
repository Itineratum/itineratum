import constDbCollections from "@/constants/dbCollections.json";
import { INewsletterEmail } from "@/constants/types/newsletterEmail";
import mongoose, { models, Schema } from "mongoose";

const newsletterEmailSchema = new Schema<INewsletterEmail>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
  },
  { collection: constDbCollections.newsletterEmails },
);

export default models.NewsletterEmail ||
  mongoose.model("NewsletterEmail", newsletterEmailSchema);
