const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOffer = async (req, res) => {
  const userId = req.user.id;
  const { amount, interestRate, durationToReturn } = req.body;

  // Validate input data
  if (!userId || !amount || !interestRate || !durationToReturn) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Create a new offer in the Offer model
    const newOffer = await prisma.offer.create({
      data: {
        amount,
        interestRate,
        durationToReturn,
        status: "active",
        userId: parseInt(userId), // Ensure userId is an integer
      },
    });

    // Respond with the created offer
    return res.status(201).json(newOffer);
  } catch (error) {
    console.error("Error creating offer:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the offer." });
  }
};
const updateOffer = async (req, res) => {
  const offerId = req.params.id;
  const { amount, interestRate, durationToReturn, status } = req.body;

  try {
    // Find the existing offer by ID
    const existingOffer = await prisma.offer.findUnique({
      where: {
        id: parseInt(offerId),
      },
    });

    if (!existingOffer) {
      return res.status(404).json({ error: "Offer not found." });
    }

    // Create an object to hold the updates
    const updates = {};

    // Check for undefined fields before updating
    if (amount !== undefined) updates.amount = amount;
    if (interestRate !== undefined) updates.interestRate = interestRate;
    if (durationToReturn !== undefined)
      updates.durationToReturn = durationToReturn;
    if (status !== undefined) updates.status = status;

    // Update the offer in the Offer model
    const updatedOffer = await prisma.offer.update({
      where: {
        id: parseInt(offerId),
      },
      data: updates,
    });

    // Respond with the updated offer
    return res.status(200).json(updatedOffer);
  } catch (error) {
    console.error("Error updating offer:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the offer." });
  }
};
const getAllOffers = async (req, res) => {
  try {
    // Fetch all offers from the database
    const offers = await prisma.offer.findMany({
      where: {
        status: "active", // You can filter based on status or other criteria
      },
      include: {
        user: true, // Optionally include the user details if needed
      },
    });

    // Respond with the list of offers
    return res.status(200).json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the offers." });
  }
};
const deleteOffer = async (req, res) => {
  const offerId = req.params.id;

  try {
    // Find the existing offer by ID
    const existingOffer = await prisma.offer.findUnique({
      where: {
        id: parseInt(offerId),
      },
    });

    if (!existingOffer) {
      return res.status(404).json({ error: "Offer not found." });
    }

    // Delete the offer from the Offer model
    await prisma.offer.delete({
      where: {
        id: parseInt(offerId),
      },
    });

    // Respond with a success message
    return res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the offer." });
  }
};

module.exports = { createOffer, updateOffer, getAllOffers, deleteOffer };
