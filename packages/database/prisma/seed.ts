import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vms.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Super Admin VMS';

  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      name: adminName,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin user seeded successfully!`);
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log(`👤 Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
