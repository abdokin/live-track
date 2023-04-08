import type { Prisma, User } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {  exportUsers } from "~/utils/exports/export_model";
import { generate_unique_track } from "~/utils/functions";
export const userRouter = createTRPCRouter({
  current_user: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirstOrThrow({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  all_users: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      orderBy: { name: "asc" },
    });
  }),
  export: protectedProcedure.mutation(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    const fileName = `export-users-${generate_unique_track()}`;
    exportUsers(fileName, users);
    return {
      message: "exported",
      path: `/exports/${fileName}`,
    };
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        phone_number: z.string().nonempty(),
        email: z.string().email(),
        address: z.string().min(3),
        cityId: z.string(),
        cin: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user_input: Prisma.UserUpdateInput = {
        ...input,
      };
      const schema = z.object({
        cityId: z.string().refine(
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
      await schema.parseAsync(input);
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...user_input,
        },
      });
      return {
        message: "User Updated",
      };
    }),
});
