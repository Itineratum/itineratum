import { credentialsLogIn } from "@/services/database/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = await req.json();
    const { email, password } = data;
    const loginRes = await credentialsLogIn(email, password);

    if (loginRes?.success) {
      return NextResponse.json({ message: "User logged in!" }, { status: 200 });
    } else {
      return NextResponse.json({ message: loginRes?.error }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occured while logging in!" },
      { status: 500 },
    );
  }
};
