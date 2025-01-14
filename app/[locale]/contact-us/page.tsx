import { appRouter } from "@/app/server/routers/root";
import ThreeGuysBackground from "@/components/atoms/three-guys-background";
import ContactUsPage from "@/components/templates/contact-us-page";
import { IFAQ } from "@/constants/types/faq";
import { createServerSideHelpers } from "@trpc/react-query/server";
import mongoose from "mongoose";

const ContactUs = async () => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { mongoose },
  });
  const faqs: IFAQ[] = await helpers.faq.getAllFAQs.fetch();
  return (
    <ThreeGuysBackground>
      <ContactUsPage faqs={faqs} />
    </ThreeGuysBackground>
  );
};

export default ContactUs;
