import { appRouter } from "@/app/server/routers/root";
import ContactUsPage from "@/components/templates/contact-us-page";
import { IFAQ } from "@/constants/types/faq";
import { createServerSideHelpers } from "@trpc/react-query/server";
import mongoose from "mongoose";

const ContactUs = async () => {
  console.log("FETCHING FAQS SERVER SIDE");
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { mongoose },
  });
  const faqs: IFAQ[] = await helpers.faq.getAllFAQs.fetch();
  return <ContactUsPage faqs={faqs} />;
};

export default ContactUs;
