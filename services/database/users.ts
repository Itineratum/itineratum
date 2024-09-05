import { AuthService } from "@/constants/enums/authService";
import { SignInError } from "@/constants/errors/signIn";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import User, { initialUser } from "@/models/User";
import { getAuthService } from "@/utils/getAuthService";
import bcrypt from "bcrypt";
import { Account, User as AuthUser } from "next-auth";

export const signIn = async ({
  user,
  account,
}: {
  user: AuthUser;
  account?: Account | null;
}) => {
  try {
    await connectToDatabase();
    const email: string = user.email!;
    const existingUser = await User.findOne({ email });
    const authService: AuthService = getAuthService(account?.provider!);

    if (!existingUser) {
      const name: string = user.name!;
      const profilePicture: string = user.image!;

      await User.create(
        initialUser(name, email, profilePicture, authService),
      ).then((result) => {
        console.log(`User ${result.id} created!`);
      });
      return true;
    } else {
      const isSameProvider = existingUser.auth_service === authService;

      if (!isSameProvider) {
        throw new Error(SignInError.logInWithoutGoogle);
      }

      console.log(
        `User with email ${email} already exists! Signing in directly.`,
      );
      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
};

export const credentialsSignUp = async (
  country: string,
  countryCode: string,
  number: string,
  email: string,
  password: string,
) => {
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists! Please sign up with a different email!",
      };
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const sanitizedNumber = number.replace(/\D/g, "");
      const phoneNumber = `${countryCode}${sanitizedNumber}`;
      await User.create({
        country,
        phone_number: phoneNumber,
        email,
        password: hashedPassword,
        auth_service: AuthService.Credentials,
        account_created: Date.now(),
      }).then((result) => {
        console.log(`User ${result.id} created!`);
      });
      return {
        success: true,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
};

export const credentialsLogIn = async (
  inputEmail: string,
  inputPassword: string,
) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: inputEmail });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    } else {
      const isValidPassword = await bcrypt.compare(
        inputPassword,
        user.password,
      );

      if (!isValidPassword) {
        return {
          success: false,
          error: "Wrong password!",
        };
      } else {
        return {
          success: true,
          data: {
            id: user._id,
            email: user.email,
          },
        };
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
};
