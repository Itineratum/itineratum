import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import NewsletterEmail from "@/models/NewsletterEmail";

export const addEmailToNewsletter = async (email: string, name: string) => {
  try {
    await connectToDatabase();
    const emailAlreadyInNewsletter = await NewsletterEmail.findOne({ email });

    if (emailAlreadyInNewsletter) {
      return {
        success: false,
        error: "Email already added to newsletter!",
      };
    } else {
      await NewsletterEmail.create({ name, email }).then((result) => {
        console.log(`Newsletter email ${result.id} created!`);
      });

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

export const removeEmailFromNewsletter = async (email: string) => {
  try {
    await connectToDatabase();
    const emailAlreadyInNewsletter = await NewsletterEmail.findOne({ email });

    if (emailAlreadyInNewsletter) {
      await NewsletterEmail.deleteOne({ email });

      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: "Email is not in newsletter!",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};

export const checkEmailInNewsletter = async (email: string) => {
  try {
    await connectToDatabase();
    const emailAlreadyInNewsletter = await NewsletterEmail.findOne({ email });

    if (emailAlreadyInNewsletter) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // await disconnectFromDatabase();
  }
};
