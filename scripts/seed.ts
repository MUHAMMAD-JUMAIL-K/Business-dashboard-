import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "employee@example.com";
  const password = await hash("password123", 10);

  // Find the first organization created by the admin
  const adminOrg = await prisma.organization.findFirst();

  if (!adminOrg) {
    console.log("No organization found. Please register an Admin first.");
    return;
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log("Regular User already exists!");
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: "Regular Employee",
      email,
      password,
      memberships: {
        create: {
          organizationId: adminOrg.id,
          role: "USER",
        },
      },
    },
  });

  console.log("Example Regular USER created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
