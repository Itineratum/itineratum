import { SignUpAction } from "@/constants/enums/signUpAction";
import { sendSignUpVerificationEmail } from "@/lib/nodeMailer";
import { credentialsSignUp } from "@/services/database/users";
import {
  generateAndSaveVerificationCode,
  verifyVerificationCode,
} from "@/services/database/verificationCodes";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = await req.json();
    const { email, action } = data;

    if (action === SignUpAction.generateCode) {
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
          { status: 200 }
        );
      } else {
        throw new Error(verificationCodeSaveRes?.error);
      }
    } else if (action === SignUpAction.verifyCode) {
      const { country, countryCode, number, password, verificationCode } = data;
      const verifyVerificationCodeRes = await verifyVerificationCode(
        email,
        verificationCode
      );

      if (!verifyVerificationCodeRes.success) {
        return NextResponse.json(
          { message: verifyVerificationCodeRes.error },
          { status: 400 }
        );
      }

      const signUpRes = await credentialsSignUp(
        country,
        countryCode,
        number,
        email,
        password
      );

      if (signUpRes?.success) {
        return NextResponse.json({ message: "User created!" }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: signUpRes?.error },
          { status: 409 } // user account already exists
        );
      }
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
