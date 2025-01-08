import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import User from "@/models/User";
import VerificationCode, {
  generateVerificationCode,
} from "@/models/VerificationCode";

export const generateAndSaveVerificationCode = async (email: string) => {
  try {
    await connectToDatabase();

    // checks whether the email is already being used to sign up
    // if it is so, it means that there is already a verification code assigned to the email in the verification_codes collection
    const isExistingEmail = await VerificationCode.findOne({ email });

    if (isExistingEmail) {
      return {
        success: false,
        error: "Verification code sent! Please check your email inbox!",
      };
    }

    const isExistingUser = await User.findOne({ email, is_deleted: false });

    if (isExistingUser) {
      return {
        success: false,
        error: "User already exists! Please sign up with a different email!",
      };
    } else {
      const verificationCode = generateVerificationCode();
      await VerificationCode.create({
        email,
        verification_code: verificationCode,
      }).then((result) => {
        console.log(`Verification code ${result.id} created!`);
      });
      return {
        success: true,
        verificationCode,
      };
    }
  } catch (error) {
    console.error(error);
  } finally {
    // await disconnectFromDatabase();
  }
};

export const verifyVerificationCode = async (
  email: string,
  inputVerificationCode: string,
) => {
  try {
    await connectToDatabase();
    const verificationCodeDocument = await VerificationCode.findOne({ email });

    if (verificationCodeDocument) {
      const isValidVerificationCode =
        verificationCodeDocument.verification_code === inputVerificationCode;

      if (isValidVerificationCode) {
        await VerificationCode.deleteOne({ email });
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error:
            "Wrong verification code! Please refer to the email for the correct one!",
        };
      }
    } else {
      return {
        sucess: false,
        error:
          "Verification code does not exist/has expired. Please sign up again!",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};
