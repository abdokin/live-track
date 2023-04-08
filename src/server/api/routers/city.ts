import { City } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { exportCities } from "~/utils/exports/export_model";
import { generate_unique_track } from "~/utils/functions";

export const cityRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.city.findMany({
      orderBy: { name: "asc" },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const schema = z.object({
        id: z.string().refine(
          async (value) => {
            const city = await ctx.prisma.city.findUnique({
              where: {
                id: value,
              },
            });
            return !!city;
          },
          {
            message: "City  Not found",
          }
        ),
      });
      const exist_input = await schema.parseAsync(input);
      await ctx.prisma.city.update({
        where: {
          id: exist_input.id,
        },
        data: input,
      });
      return {
        message: "City Updated",
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.city.create({
        data: input,
      });
      return {
        message: "City Created",
      };
    }),

  export: protectedProcedure.mutation(async ({ ctx }) => {
    const cities = await ctx.prisma.city.findMany();
    const fileName = `export-cities-${generate_unique_track()}`;
    exportCities(fileName, cities);
    return {
      message: "exported",
      path: `/exports/${fileName}`,
    };
  }),
});
