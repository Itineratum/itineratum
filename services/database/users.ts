import { AuthService } from "@/constants/enums/authService";
import { SignInError } from "@/constants/errors/signIn";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import { deleteImage } from "@/lib/uploadThing";
import User, { initialUser } from "@/models/User";
import { getAuthService } from "@/utils/getAuthService";
import bcrypt from "bcrypt";
import { Account, User as AuthUser } from "next-auth";
import { UTApi } from "uploadthing/server";

// used by Google provider login
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
    const name: string = user.name!;
    const profilePicture: string = user.image!;

    if (existingUser && !existingUser.is_deleted) {
      const isSameAuthService = existingUser.auth_service === authService;

      if (!isSameAuthService) {
        // allow users who signed up using credentials to sign in using Google, combine their accounts
        const isCredentialsSignUpGoogleLogin =
          existingUser.auth_service === AuthService.Credentials &&
          authService === AuthService.Google;

        if (!isCredentialsSignUpGoogleLogin) {
          throw new Error(SignInError.logInWithoutGoogle);
        } else {
          await User.findOneAndUpdate(
            { email },
            { profile_picture: profilePicture, name },
          );
          console.log(
            `User with email ${email} has been combined with details from their Google account!`,
          );
        }
      }

      console.log(
        `User with email ${email} already exists! Signing in directly.`,
      );
      return true;
    } else {
      const userDocument = initialUser(
        name,
        email,
        profilePicture,
        authService,
      );

      if (existingUser && existingUser.is_deleted) {
        // returning user
        const update = {
          $set: {
            ...userDocument,
            is_deleted: false,
          },
        };
        await User.findOneAndUpdate({ email, is_deleted: true }, update);
      } else {
        // brand new user
        await User.create(userDocument).then((result) => {
          console.log(`User ${result.id} created!`);
        });
      }

      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

// mainly to retrieve the name of the user (who signed up using Google) who has changed their name
export const googleLogIn = async (email: string) => {
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email, is_deleted: false });

    if (existingUser) {
      return {
        isExistingUser: true,
        id: existingUser._id,
        name: existingUser.first_name,
        image: existingUser.profile_picture,
      };
    } else {
      return {
        isExistingUser: false,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
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

    if (existingUser && !existingUser.is_deleted) {
      return {
        success: false,
        error: "User already exists! Please sign up with a different email!",
      };
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const sanitizedNumber = number.replace(/\D/g, "");
      const phoneNumber = `${countryCode}${sanitizedNumber}`;
      const userDocument = {
        country,
        phone_number: phoneNumber,
        email,
        password: hashedPassword,
        auth_service: AuthService.Credentials,
        account_created: Date.now(),
      };

      if (existingUser && existingUser.is_deleted) {
        // returning user
        const update = {
          $set: {
            ...userDocument,
            is_deleted: false,
          },
        };
        await User.findOneAndUpdate({ email, is_deleted: true }, update);
      } else {
        // brand new user
        await User.create(userDocument).then((result) => {
          console.log(`User ${result.id} created!`);
        });
      }

      return {
        success: true,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const credentialsLogIn = async (
  inputEmail: string,
  inputPassword: string,
) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: inputEmail, is_deleted: false });

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
            firstName: user.first_name,
            image: user.profile_picture,
          },
        };
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const retrieveCurrencyLanguage = async (email: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    } else {
      return {
        success: true,
        data: {
          currency: user.currency,
          language: user.language,
        },
      };
    }
  } catch (error) {
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const updateUser = async (email: string, update: Object) => {
  try {
    await connectToDatabase();
    const user = await User.find({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    } else {
      await User.findOneAndUpdate({ email }, update);
      return {
        success: true,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const retrieveUserDetails = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    } else {
      return {
        success: true,
        data: user,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const deleteUser = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    } else {
      // do a soft delete, so that we can still keep track of whether it is the user's first time signing up or not if they sign up again in the future
      const fields = Object.keys(user);
      const permanentFields = ["_id", "email", "is_deleted"];
      const fieldsToDelete = fields.filter(
        (field) => !permanentFields.includes(field),
      );
      const unsetFields: Record<string, string> = {};
      fieldsToDelete.map((fieldToDelete) => {
        unsetFields[fieldToDelete] = "";
      });

      const profilePicture = await User.findOne({ email }).then(
        (result) => result.profile_picture,
      );

      // delete profile picture from UploadThing
      await deleteImage(profilePicture);

      const softDeleteUpdate = {
        $unset: unsetFields,
        $set: {
          is_deleted: true,
        },
      };
      await User.findOneAndUpdate({ email }, softDeleteUpdate);
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

export const verifyUserPassword = async (
  email: string,
  inputPassword: string,
) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

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

      if (isValidPassword) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: "Wrong password!",
        };
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};
