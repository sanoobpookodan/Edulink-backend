import "dotenv/config";
import bcrypt from "bcrypt";
import { ADMIN } from "../src/constants/roles.js";
import prisma from "../src/config/prisma.js";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: ADMIN,
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
