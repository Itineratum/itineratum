import { credentialsSignUp } from "@/services/database/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = await req.json();
    const { country, number, email, password } = data;
    const signUpSuccessful = await credentialsSignUp(
      country,
      number,
      email,
      password,
    );

    if (signUpSuccessful?.success) {
      return NextResponse.json({ message: "User created!" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: signUpSuccessful?.error },
        { status: 409 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occured while signing the user up!" },
      { status: 500 },
    );
  }
};
