import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = await hash("password123", 10);
  const company = "Acme Corp";

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log("User already exists!");
    return;
  }

  const org = await prisma.organization.create({
    data: {
      name: company,
      slug: "acme-corp-" + Date.now(),
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Admin User",
      email,
      password,
      memberships: {
        create: {
          organizationId: org.id,
          role: "ADMIN",
        },
      },
    },
  });

  console.log("Example user created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
