import { prisma } from '../lib/prisma';

async function main() {
  await prisma.restaurant.upsert({
    where: { slug: 'demo-restaurant' },
    update: {},
    create: {
      slug: 'demo-restaurant',
      name: 'Demo Restaurant',
      tonePreset: '港式貼地',
      defaultHashtags: '#demo, #hkfoodie'
    }
  });
  console.log('Seeded demo restaurant');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
