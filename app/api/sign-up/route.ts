import { SignUpStep } from "@/constants/enums/signUpSteps";
import { sendSignUpVerificationEmail } from "@/lib/nodeMailer";
import { credentialsSignUp } from "@/services/database/users";
import { generateAndSaveVerificationCode } from "@/services/database/verificationCodes";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = await req.json();
    const { country, countryCode, number, email, password, step } = data;

    if (step === SignUpStep.emailVerification) {
      const verificationCodeSaveRes =
        await generateAndSaveVerificationCode(email);

      if (
        verificationCodeSaveRes?.success &&
        verificationCodeSaveRes.verificationCode
      ) {
        const verificationCode = verificationCodeSaveRes.verificationCode;
        await sendSignUpVerificationEmail(email, verificationCode);

        return NextResponse.json(
          { message: "Verification code sent!" },
          { status: 200 },
        );
      } else {
        throw new Error(verificationCodeSaveRes?.error);
      }
    } else if (step === SignUpStep.signUp) {
      const signUpRes = await credentialsSignUp(
        country,
        countryCode,
        number,
        email,
        password,
      );

      if (signUpRes?.success) {
        return NextResponse.json({ message: "User created!" }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: signUpRes?.error },
          { status: 409 }, // user account already exists
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occured while signing the user up!" },
      { status: 500 },
    );
  }
};
