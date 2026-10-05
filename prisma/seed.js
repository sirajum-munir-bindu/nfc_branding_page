const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting TapCard Database Seed ---');

  // 1. Seed or update Admin User
  const adminEmail = 'admin@tapcard.com';
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  // Hash compatible with both Django PBKDF2 hasher and Next.js crypto verifier
  const hashedPassword = 'pbkdf2_sha256$1000000$He9mEjvXj1XKVNWHRm0HWo$yD8rbqbupPzTL1UBbO37jpqMFTMNa9yYITsfX+p0oQA=';

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isStaff: true,
        isSuperuser: true,
        isActive: true,
        firstName: 'System',
        lastName: 'Administrator',
      },
    });
    console.log(`Created admin user: ${admin.email} (password: admin123)`);
  } else {
    // Update password to admin123 so default credentials work
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: hashedPassword,
        isStaff: true,
        isSuperuser: true,
        role: 'ADMIN',
      },
    });
    console.log(`Updated existing admin user ${adminEmail} with seed password (admin123).`);
  }

  // 2. Seed Default Site Settings
  await prisma.siteSetting.upsert({
    where: { key: 'showcase_video_url' },
    update: {},
    create: {
      key: 'showcase_video_url',
      value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Landing page product showcase video URL',
    },
  });

  // 3. Check and Seed Initial Card Designs if empty
  const cardDesignCount = await prisma.cardDesign.count();
  if (cardDesignCount === 0) {
    await prisma.cardDesign.createMany({
      data: [
        {
          name: 'Essential Black',
          editionCode: 'black',
          description: 'Sleek matte obsidian finish with laser-etched metallic accents.',
          price: 599.0,
          primaryColor: '#0b0f19',
          accentColor: '#38bdf8',
          textureType: 'matte-metallic',
          features: ['Laser-etched details', 'Dual-frequency chip', 'Waterproof finish'],
          displayOrder: 1,
        },
        {
          name: 'Midnight Purple',
          editionCode: 'purple',
          description: 'Deep cosmic violet with radiant cyan cybernetic glow.',
          price: 699.0,
          primaryColor: '#170e2b',
          accentColor: '#c084fc',
          textureType: 'gloss-metallic',
          features: ['Deep chromatic sheen', 'Subtle prism refraction', 'Impact resistant'],
          displayOrder: 2,
        },
        {
          name: 'Sovereign Gold',
          editionCode: 'gold',
          description: 'Executive brushed champagne gold for uncompromising prestige.',
          price: 899.0,
          primaryColor: '#241a06',
          accentColor: '#facc15',
          textureType: 'brushed-gold',
          features: ['24K plated foil trim', 'Executive weight core', 'Custom monogram ready'],
          displayOrder: 3,
        },
      ],
    });
    console.log('Seeded default Card Designs.');
  }

  // 4. Check and Seed FAQs if empty
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: 'How does the TapCard NFC business card work?',
          answer: 'TapCard contains an embedded NFC chip and dynamic QR code. Simply tap it against any modern iPhone or Android smartphone, and your digital business profile instantly opens in their browser—no app required.',
          category: 'General',
          displayOrder: 1,
        },
        {
          question: 'Do other people need an app to receive my contact info?',
          answer: 'No app is needed! Your contact profile opens instantly in their native mobile browser on any smartphone.',
          category: 'General',
          displayOrder: 2,
        },
        {
          question: 'Can I update my details after purchasing?',
          answer: 'Yes! Your digital profile link is fully dynamic. You can update your phone, social links, and bio anytime without replacing the physical card.',
          category: 'Features',
          displayOrder: 3,
        },
      ],
    });
    console.log('Seeded default FAQs.');
  }

  console.log('--- Database Seed Complete ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
