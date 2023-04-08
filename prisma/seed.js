import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const status = await prisma.status.createMany({
    data: [
      {
        name: "Pending",
        style: "yellow",
      },
      {
        name: "Ready to ship",
        style: "blue",
      },
    ],
  });

  const city = await prisma.city.createMany({
    data: [
      {
        name: "New York",
      },
      {
        name: "Los Angeles",
      },
      {
        name: "Los Angeles",
      },
    ],
  });

  const work_flow = await prisma.workFlow.createMany({
    data: [
      {
        name: "Forward pick up",
        code: "FPU",
        style: "yellow",
      },
      {
        name: "Forward Drop Of",
        code: "FDF",
        style: "purple",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
