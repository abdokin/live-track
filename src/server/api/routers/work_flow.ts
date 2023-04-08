import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { exportWorkFlow } from "~/utils/exports/export_model";
import { generate_unique_track } from "~/utils/functions";

export const workFlowRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workFlow.findMany({
      orderBy: { name: "asc" },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        code: z.string().nonempty(),
        style: z.string().nonempty(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const schema = z.object({
        id: z.string().refine(
          async (value) => {
            const work = await ctx.prisma.workFlow.findUnique({
              where: {
                id: value,
              },
            });
            return !!work;
          },
          {
            message: "Work Flow  Not found",
          }
        ),
      });
      const exist_in = await schema.parseAsync(input);
      await ctx.prisma.workFlow.update({
        where: {
          id: exist_in.id,
        },
        data: input,
      });
      return {
        message: "Work Flow Updated",
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        code: z.string().nonempty(),
        style: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.workFlow.create({
        data: input,
      });
      return {
        message: "Work Flow Updated",
      };
    }),

  export: protectedProcedure.mutation(async ({ ctx }) => {
    const workFlows = await ctx.prisma.workFlow.findMany();
    const fileName = `export-work-flows-${generate_unique_track()}`;
    exportWorkFlow(fileName, workFlows);
    return {
      message: "exported",
      path: `/exports/${fileName}`,
    };
  }),
});
