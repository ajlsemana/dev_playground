import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Clear existing data (optional but useful during development)
  await prisma.ruleDecision.deleteMany();
  await prisma.actionLog.deleteMany();
  await prisma.case.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.customer.deleteMany();

  // Create Customer
  const customer = await prisma.customer.create({
    data: {
      name: "John Doe",
      phone: "0501234567",
      email: "john@xyz.com",
      country: "UAE",
      riskScore: 85
    }
  });

  // Create Loan
  const loan = await prisma.loan.create({
    data: {
      customerId: customer.id,
      principal: 10000,
      outstanding: 8000,
      dueDate: new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)), // 10 days overdue
      status: "ACTIVE"
    }
  });

  console.log("Seed completed:", { customer, loan });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });