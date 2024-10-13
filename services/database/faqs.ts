import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import FAQ from "@/models/FAQ";

export const retrieveFAQs = async () => {
  try {
    await connectToDatabase();
    const faqs = await FAQ.find({});

    console.log("FAQS", faqs);

    if (faqs && faqs.length > 0) {
      return {
        success: true,
        data: faqs,
      };
    } else {
      return {
        sucess: false,
        error: "Retrieval of FAQs failed!",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
};
