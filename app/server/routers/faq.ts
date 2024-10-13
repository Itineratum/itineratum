import { retrieveFAQs } from "@/services/database/faqs";
import { TRPCError } from "@trpc/server";
import { getAllFAQsSchema } from "../schemas/faq";
import { publicProcedure, router } from "../trpc";

export const faqRouter = router({
  getAllFAQs: publicProcedure
    .input(getAllFAQsSchema.input)
    .output(getAllFAQsSchema.output)
    .query(async () => {
      const retrieveFAQsRes = await retrieveFAQs();

      if (!retrieveFAQsRes.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: retrieveFAQsRes?.error!,
        });
      }

      return retrieveFAQsRes.data;
    }),
});

export type FAQRouter = typeof faqRouter;
