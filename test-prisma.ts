import prisma from './src/lib/prisma';

async function main() {
  try {
    const users = await prisma.users.findMany();
    console.log('Prisma successfully connected to the database!');
    console.log(`Found ${users.length} users in the public.users table.`);
    console.log(users);
  } catch (error) {
    console.error('Error connecting to database with Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
