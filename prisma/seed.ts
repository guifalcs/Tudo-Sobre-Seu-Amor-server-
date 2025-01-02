import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const name = process.env.ADMIN_NAME || 'admin'
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10);

  const subscriptionNone = await prisma.subscription.upsert({
    where:{ title: 'Nenhum'},
    update:{},
    create:{
      title: 'Nenhum',
      price: 0.0,    
    }
  });

  const subscriptionBasico = await prisma.subscription.upsert({
    where:{ title: 'Básico'},
    update:{},
    create:{
      title: 'Básico',
      price: 0.0,    
    }
  });

  const subscriptionRomantico = await prisma.subscription.upsert({
    where:{ title: 'Romântico'},
    update:{},
    create:{
      title: 'Romântico',
      price: 9.99,    
    }
  });

  const subscriptionApaixonado = await prisma.subscription.upsert({
    where:{ title: 'Apaixonado'},
    update:{},
    create:{
      title: 'Apaixonado',
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