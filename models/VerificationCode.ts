import { IVerificationCode } from "@/constants/types/verificationCode";
import mongoose, { models, Schema } from "mongoose";

const verificationCodeSchema = new Schema<IVerificationCode>({
  email: { type: String, required: true },
  verfication_code: { type: String, required: true },
  expires_at: { type: Date, required: true },
});

export default models.VerificationCode ||
  mongoose.model("VerificationCode", verificationCodeSchema);
