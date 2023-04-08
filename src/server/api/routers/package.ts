import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generate_unique_track } from "~/utils/functions";
import type { Prisma } from "@prisma/client";
export const packageRouter = createTRPCRouter({
  all_packages: protectedProcedure.query(async ({ ctx }) => {
    const packages = await ctx.prisma.package.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        shipping_method: true,
        driver: true,
        shipper: {
          include: {
            city: true,
          },
        },
        work_flow: true,
        status: true,
        history: true,
        creator: true,
        updator: true,
        customer: {
          include: {
            city: {
              include: {
                shipmentProvider: true,
              },
            },
          },
        },
      },
    });
    return packages;
  }),
  shipping_method: protectedProcedure.query(async ({ ctx }) => {
    const methods = await ctx.prisma.workFlow.findMany();
    return methods;
  }),
  cities: protectedProcedure.query(async ({ ctx }) => {
    const cities = await ctx.prisma.city.findMany();
    return cities;
  }),
  create: protectedProcedure
    .input(
      z.object({
        customer_name: z.string().nonempty(),
        customer_phone: z.string().nonempty(),
        customer_address: z.string().nonempty(),
        customer_city_id: z
          .string({
            required_error: "Customer City required",
            invalid_type_error: "Customer City invalid",
          })
          .nonempty({
            message: "Customer City required",
          }),
        customer_email: z.string().email().optional(),
        customer_cin: z.string().optional(),
        reference: z.string().nonempty({
          message: "reference required",
        }),
        amount: z.number(),
        weight: z.number(),
        shipping_method_id: z.string({
          required_error: "shipping method required",
          invalid_type_error: "shipping method invalid",
        }),
        declared_value: z.number(),
        prof_distributed_object: z.boolean(),
        fragile: z.boolean(),
        description: z.string().optional(),
        check_package: z.boolean(),
        city_id: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const schema_exists = z.object({
        customer_city_id: z.string().refine(
          async (value) => {
            const city = await ctx.prisma.city.findUnique({
              where: {
                id: value,
              },
            });
            return !!city;
          },
          {
            message: "Customer City  Not found",
          }
        ),
        city_id: z.string().refine(
          async (value) => {
            const city = await ctx.prisma.city.findUnique({
              where: {
                id: value,
              },
            });
            return !!city;
          },
          {
            message: "Package City  Not found",
          }
        ),
        shipping_method_id: z.string().refine(
          async (value) => {
            const shipping_method = await ctx.prisma.workFlow.findUnique({
              where: {
                id: value,
              },
            });
            return !!shipping_method;
          },
          {
            message: "Shipping method Not found",
          }
        ),
      });
      const exist_input = await schema_exists.parseAsync(input);
      const status = await ctx.prisma.status.findFirstOrThrow({
        where: {
          name: "Pending",
        },
      });
      const workflow = await ctx.prisma.workFlow.findFirstOrThrow({
        where: {
          code: "FDF",
        },
      });

      const customer = await ctx.prisma.customer.create({
        data: {
          name: input.customer_name,
          address: input.customer_address,
          phone: input.customer_address,
          city: {
            connect: {
              id: exist_input.customer_city_id,
            },
          },
          shipperId: ctx.session.user.id,
        },
      });
      // const hub_input: Prisma.ShipmentProviderCreateInput = {
      //   name: "York-hub",
      //   image: ctx.session.user.image ?? "",
      //   owner: {
      //     connect: {
      //       id: ctx.session.user.id,
      //     },
      //   },
      //   city: {
      //     connect: {
      //       id: input.customer_city_id,
      //     },
      //   },
      // };
      const last_mile = await ctx.prisma.shipmentProvider.findFirstOrThrow({
        where: {
          cityId: exist_input.city_id,
        },
      });

      const first_mile = await ctx.prisma.shipmentProvider.findFirstOrThrow({
        where: {
          cityId: exist_input.city_id,
        },
      });

      const package_input: Prisma.PackageCreateInput = {
        tracking_number: "MC-" + generate_unique_track(),
        reference: input.reference,
        customer: {
          connect: {
            id: customer.id,
          },
        },
        shipping_method: {
          connect: {
            id: exist_input.shipping_method_id,
          },
        },
        work_flow: {
          connect: {
            id: workflow.id,
          },
        },
        city: {
          connect: {
            id: input.city_id,
          },
        },
        status: {
          connect: {
            id: status.id,
          },
        },
        creator: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        updator: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        driver: {
          // TODO : make it optional
          connect: {
            id: ctx.session.user.id,
          },
        },
        shipper: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        last_hub: {
          connect: {
            id: last_mile.id,
          },
        },
        first_hub: {
          connect: {
            id: first_mile.id,
          },
        },
      };
      const package_created = await ctx.prisma.package.create({
        data: package_input,
        include: {
          history: true,
        },
      });

      await ctx.prisma.package_History.create({
        data: {
          packageData: JSON.stringify(package_created),
          packageId: package_created.id,
        },
      });
      return {
        message: "package Created",
      };
    }),
});
