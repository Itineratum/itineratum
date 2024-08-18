import { AuthService } from "@/constants/enums/authService";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import User, { initialUser } from "@/models/User";
import { getAuthService } from "@/utils/getAuthService";
import { Account, User as AuthUser } from "next-auth";

export const signIn = async ({
  user,
  account,
}: {
  user: AuthUser;
  account: Account;
}) => {
  try {
    await connectToDatabase();
    const email: string = user.email!;
    const isExistingUser = await User.findOne({ email });

    if (!isExistingUser) {
      const name: string = user.name!;
      const profilePicture: string = user.image!;
      const authService: AuthService = getAuthService(account.provider);
      await User.create(
        initialUser(name, email, profilePicture, authService),
      ).then((result) => {
        console.log(`User ${result.id} created!`);
      });
    } else {
      console.log(
        `User with email ${email} already exists! Signing in directly.`,
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    await disconnectFromDatabase();
  }
};
