import { userRouter } from "./user";
import { router } from "../trpc";
import { faqRouter } from "./faq";
import { newsletterEmailRouter } from "./newsletterEmail";

export const appRouter = router({
  user: userRouter,
  faq: faqRouter,
  newsletterEmail: newsletterEmailRouter,
});

export type AppRouter = typeof appRouter;
