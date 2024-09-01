import { AuthService } from "@/constants/enums/authService";
import User from "@/models/User";
import { connectToDatabase } from "lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectToDatabase();

    return NextResponse.json(
      { message: "Database connected successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occured while conencting to the database!" },
      { status: 500 },
    );
  }
};

// export const POST = async (req: NextRequest, res: NextResponse) => {
//   try {
//     await connectToDatabase();
//     const data = await req.json();

//     const { country, email } = data;

//     const user = await User.create({
//       name: "Hello",
//       country: country,
//       phone_number: 12345678,
//       email: email,
//       auth_service: AuthService.Google,
//     });

//     return NextResponse.json({ user }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "An error occured!" }, { status: 500 });
//   }
// };
