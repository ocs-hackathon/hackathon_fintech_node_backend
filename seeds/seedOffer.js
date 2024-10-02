const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedOffers = async () => {
  try {
    const userId = 1; // Fixed userId for this seed
    for (let i = 1; i <= 50; i++) {
      // Check if the offer with id already exists
      const existingOffer = await prisma.offer.findUnique({
        where: {
          id: i, // Checking for offers with IDs from 1 to 50
        },
      });

      if (existingOffer) {
        console.log(`Offer with id ${i} already exists. Skipping creation.`);
        continue; // Skip creating this offer if it already exists
      }

      // Generate the amount between 5000 and 100000
      const amount = Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000;

      // Determine interest rate based on amount
      let interestRate;
      if (amount <= 20000) {
        interestRate = 10;
      } else if (amount <= 50000) {
        interestRate = 8;
      } else if (amount <= 80000) {
        interestRate = 7;
      } else {
        interestRate = 5;
      }

      // Determine duration to return based on amount
      let durationToReturn;
      if (amount <= 20000) {
        durationToReturn = Math.floor(Math.random() * (6 - 2 + 1)) + 2; // Between 2 and 6 months
      } else if (amount <= 50000) {
        durationToReturn = Math.floor(Math.random() * (9 - 6 + 1)) + 6; // Between 6 and 9 months
      } else {
        durationToReturn = Math.floor(Math.random() * (12 - 9 + 1)) + 9; // Between 9 and 12 months
      }

      // Status of the offer
      const status = 'active'; // Default status

      // Create each offer one by one using prisma.offer.create
      await prisma.offer.create({
        data: {
          id: i, // Ensure ID matches the loop
          amount: amount,
          interestRate: interestRate,
          durationToReturn: durationToReturn,
          status: status,
          userId: userId,
        },
      });
      console.log(`Created offer ${i}:`, { amount, interestRate, durationToReturn, status });
    }
  } catch (error) {
    console.error('Error creating seed offers:', error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = seedOffers;
