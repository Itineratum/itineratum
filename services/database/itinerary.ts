import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import Itinerary from "@/models/Itinerary";

export const retrieveFAQs = async () => {
  try {
    await connectToDatabase();
    const faqs = await Itinerary.find({});

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
