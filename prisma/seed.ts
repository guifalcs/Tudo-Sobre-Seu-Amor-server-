import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const name = process.env.ADMIN_NAME || 'admin'
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      password: hashedPassword,
      status: 'active'
    },
  });

  const subscriptionBasico = await prisma.subscription.upsert({
    where:{ title: 'basico'},
    update:{},
    create:{
      title: 'basico',
      price: 0.0,    
    }
  });

  const subscriptionRomantico = await prisma.subscription.upsert({
    where:{ title: 'romantico'},
    update:{},
    create:{
      title: 'romantico',
      price: 9.99,    
    }
  });

  const subscriptionApaixonado = await prisma.subscription.upsert({
    where:{ title: 'apaixonado'},
    update:{},
    create:{
      title: 'apaixonado',
      price: 19.99,    
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });