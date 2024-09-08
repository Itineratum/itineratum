import { generateVerificationCodeInput, generateVerificationCodeOutput } from "../schemas/user";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getTodos: publicProcedure.query(async () => {
    return [10, 20, 30];
  }),
  generateVerificationCode: publicProcedure
    .input(generateVerificationCodeInput)
    .output(generateVerificationCodeOutput)
    .query(async () => {
      console.log('do something')
    }),
});

export type IndexRouter = typeof userRouter;
