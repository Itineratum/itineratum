import constDbCollections from "@/constants/dbCollections.json";
import { IVerificationCode } from "@/constants/types/verificationCode";
import mongoose, { models, Schema } from "mongoose";

const verificationCodeSchema = new Schema<IVerificationCode>(
  {
    email: { type: String, required: true },
    verification_code: { type: String, required: true },
    created_at: { type: Date, default: Date.now(), expires: 15 * 60 },
  },
  { collection: constDbCollections.verificationCodes },
);

export const generateVerificationCode = () => {
  const array = crypto.getRandomValues(new Uint32Array(1));
  const verificationCode = (array[0] % 1000000).toString().padStart(6, "0");
  return verificationCode;
};

export default models.VerificationCode ||
  mongoose.model("VerificationCode", verificationCodeSchema);
