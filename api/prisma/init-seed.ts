import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.ruleDecision.deleteMany();
  await prisma.actionLog.deleteMany();
  await prisma.case.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.customer.deleteMany();

  const seedData = [
    {
      name: "John Doe",
      riskScore: 85,
      dpdDays: 10,
      status: "OPEN"
    },
    {
      name: "Sarah Khan",
      riskScore: 30,
      dpdDays: 3,
      status: "OPEN"
    },
    {
      name: "Michael Lee",
      riskScore: 55,
      dpdDays: 18,
      status: "IN_PROGRESS"
    },
    {
      name: "Ahmed Ali",
      riskScore: 92,
      dpdDays: 40,
      status: "OPEN"
    },
    {
      name: "Maria Santos",
      riskScore: 20,
      dpdDays: 7,
      status: "RESOLVED"
    }
  ];

  for (const item of seedData) {

    const customer = await prisma.customer.create({
      data: {
        name: item.name,
        phone: "0500000000",
        email: `${item.name.toLowerCase().replace(" ", ".")}@xyz.com`,
        country: "UAE",
        riskScore: item.riskScore
      }
    });

    const dueDate = new Date(Date.now() - (item.dpdDays * 24 * 60 * 60 * 1000));

    const loan = await prisma.loan.create({
      data: {
        customerId: customer.id,
        principal: 10000,
        outstanding: 7000,
        dueDate,
        status: "ACTIVE"
      }
    });

    await prisma.case.create({
      data: {
        customerId: customer.id,
        loanId: loan.id,
        dpd: item.dpdDays,
        stage: "SOFT",
        status: item.status
      }
    });

  }

  console.log("Seed completed with multiple records");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });