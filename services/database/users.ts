import { AuthService } from "@/constants/enums/authService";
import { SignInError } from "@/constants/errors/signIn";
import { CalendarEvent } from "@/constants/types/calendarEvent";
import { ToDo } from "@/constants/types/toDo";
import { connectToDatabase } from "@/lib/db";
import { deleteImage } from "@/lib/uploadThing";
import User, { initialUser } from "@/models/User";
import { getAuthService } from "@/utils/getAuthService";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { Account, User as AuthUser } from "next-auth";
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

      if (isSameAuthService) {
        console.log(
          `User with email ${email} already exists! Signing in directly.`,
        );
        return true;
      } else {
        throw new Error(SignInError.logInWithoutGoogle);
      }
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
        generated_itineraries: [],
        calendar_events: [],
        todo_list: [],
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
    // await disconnectFromDatabase();
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

export const retrieveUserSavedItineraryIds = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const savedItineraries = user.generated_itineraries;

    if (savedItineraries) {
      return {
        success: true,
        data: savedItineraries,
      };
    } else {
      return {
        success: false,
        error: "Failed to retrieve user-saved itineraries!",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const saveUserItinerary = async (email: string, itineraryId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const update = {
      $push: {
        generated_itineraries: itineraryId,
      },
    };
    const result = await User.updateOne({ email }, update);

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Save itinerary to user failed" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const insertUserCalendarEvent = async (
  email: string,
  calendarEvent: any,
) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const update = {
      $push: {
        calendar_events: calendarEvent,
      },
    };

    const result = await User.updateOne({ email }, update);

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Insert user calendar event failed" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const retrieveUserCalendarEvents = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const calendarEvents = user.calendar_events;

    if (calendarEvents) {
      return {
        success: true,
        data: calendarEvents,
      };
    } else {
      return {
        success: false,
        error: "Failed to retrieve user calendar events!",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const retrieveUserToDoList = async (email: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const todoList = user.todo_list;

    if (todoList) {
      return {
        success: true,
        data: todoList,
      };
    } else {
      return {
        success: false,
        error: "Failed to retrieve user to-do list!",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const insertUserToDo = async (email: string, toDo: ToDo) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const update = {
      $push: {
        todo_list: toDo,
      },
    };

    const result = await User.updateOne({ email }, update);

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Insert user to do failed!" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const updateUserToDo = async (
  email: string,
  toDoIndex: number,
  toDoIsComplete: boolean,
) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const update = {
      $set: {
        [`todo_list.${toDoIndex}.isComplete`]: toDoIsComplete,
      },
    };

    const result = await User.updateOne({ email }, update);

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Modify user to do failed!" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const updateUserCalendarEvent = async (
  email: string,
  modifiedCalendarEvent: CalendarEvent,
) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const update = {
      $set: {
        "calendar_events.$[element]": modifiedCalendarEvent,
      },
    };
    // credits to https://www.mongodb.com/community/forums/t/updating-nested-array-object-with-specific-condition/228238/3
    const arrayFilters = {
      arrayFilters: [
        {
          "element._id": { $eq: modifiedCalendarEvent._id },
        },
      ],
    };

    const result = await User.updateOne({ email }, update, arrayFilters);

    if (result.modifiedCount > 0) {
      return { success: true };
    } else {
      return { success: false, error: "Modify user calendar event failed!" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const removeUserCalendarEvent = async (
  email: string,
  calendarEventId: ObjectId,
) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found!",
      };
    }

    const update = {
      $pull: {
        calendar_events: {
          _id: calendarEventId,
        },
      },
    };

    const result = await User.updateOne({ email }, update);

    if (result.acknowledged) {
      return { success: true };
    } else {
      return { success: false, error: "Remove user calendar event failed!" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};
