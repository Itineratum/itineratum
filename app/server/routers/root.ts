import { userRouter } from "./user";
import { router } from "../trpc";
import { faqRouter } from "./faq";

export const appRouter = router({
  user: userRouter,
  faq: faqRouter,
});

export type AppRouter = typeof appRouter;
