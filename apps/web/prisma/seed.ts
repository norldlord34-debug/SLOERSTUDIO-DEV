import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@sloerstudio.com";
  const password = process.env.ADMIN_PASSWORD ?? "SloerAdmin2025!";
  const name = "SloerStudio Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "SUPER_ADMIN",
      plan: "ENTERPRISE",
      emailVerified: true,
    },
  });

  console.log(`✅ Admin user created:`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role:  ${admin.role}`);
  console.log(`   Plan:  ${admin.plan}`);
  console.log(`   ID:    ${admin.id}`);
  console.log(``);
  console.log(`⚠️  Change the default password immediately after first login!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
