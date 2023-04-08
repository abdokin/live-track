import { createTRPCRouter } from "~/server/api/trpc";
import { packageRouter } from "./routers/package";
import { userRouter } from "./routers/user";
import { workFlowRouter } from "./routers/work_flow";
import { cityRouter } from "./routers/city";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  package: packageRouter,
  user: userRouter,
  work_flow: workFlowRouter,
  city: cityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
