import { userRouter } from "./user";
import { router } from "../trpc";
import { faqRouter } from "./faq";
import { newsletterEmailRouter } from "./newsletterEmail";
import { itineraryRouter } from "./itinerary";
import { feedbackFormRouter } from "./feedbackForm";

export const appRouter = router({
  user: userRouter,
  faq: faqRouter,
  newsletterEmail: newsletterEmailRouter,
  itinerary: itineraryRouter,
  feedbackForm: feedbackFormRouter,
});

export type AppRouter = typeof appRouter;
