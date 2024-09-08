import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../server/routers/root";

// creates a TRPC react client for the client-side components
export const trpc = createTRPCReact<AppRouter>({});
