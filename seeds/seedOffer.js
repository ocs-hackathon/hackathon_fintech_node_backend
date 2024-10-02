const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedOffers = async (req, res) => {
  try {
    const userId = 1;
    const offers = [];

    for (let i = 0; i < 50; i++) {

      const amount = Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000;

      const interestRate = amount <= 20000 ? 10 :
                           amount <= 50000 ? 8 :
                           amount <= 80000 ? 7 : 5;

      const durationToReturn = amount <= 20000 ? Math.floor(Math.random() * (6 - 2 + 1)) + 2 :
                               amount <= 50000 ? Math.floor(Math.random() * (9 - 6 + 1)) + 6 :
                               Math.floor(Math.random() * (12 - 9 + 1)) + 9;
      offers.push({
        amount: amount,
        interestRate: interestRate,
        durationToReturn: durationToReturn,
        status: 'active',
        userId: userId,
      });
    }

    await prisma.offer.createMany({
      data: offers
    });

    res.status(201).json({ message: '50 offers created successfully!' });
  } catch (error) {
    console.error('Error creating seed offers:', error);
    res.status(500).json({ message: 'Failed to create seed offers' });
  }
};

module.exports = seedOffers;
