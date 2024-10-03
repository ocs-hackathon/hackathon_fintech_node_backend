const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyPassword } = require("../utils/passwordUtils");
const { createAccessToken } = require("../utils/authUtils");
const nodemailer = require("nodemailer");

const sendEmail = async (email, username, isApproved) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "exopain2930@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
  });

  const subject = isApproved
    ? "Your Account Has Been Approved"
    : "Your Account Application Was Rejected";

  const messageText = isApproved
    ? `Hello ${username},\n\nCongratulations! Your account has been approved. You can now log in and start using our services.\n\nBest regards,\nIncluFi`
    : `Hello ${username},\n\nWe regret to inform you that your account application was rejected. If you believe this was a mistake, please contact our support team.\n\nBest regards,\nInculFi`;

  const mailOptions = {
    from: "exopain2930@gmail.com",
    to: email,
    subject: subject,
    text: messageText,
  };

  await transporter.sendMail(mailOptions);
};


const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.json({ errors: { email: "Invalid email" } });
    }

    if (!(await verifyPassword(password, user.password))) {
      return res.json({ errors: { password: "Incorrect password" } });
    }

    const accessToken = createAccessToken(user);

    res.json({
      message: "Sign-in successful",
      accessToken,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  const { message } = req.body;
  const userId = parseInt(req.params.id);

  if (!message || !userId) {
    return res.status(400).json({ message: "User ID and message are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isAccepted = message.toLowerCase() === "accept";

    if (isAccepted) {
      const kycTemp = await prisma.kYCTemp.findFirst({ where: { userId } });

      if (!kycTemp) {
        return res.status(404).json({ message: "KYC information not found." });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          fullName: kycTemp.fullName,
          address: kycTemp.address,
          phoneNumber: kycTemp.phoneNumber,
          idFile: kycTemp.idFile,
          bankStatement: kycTemp.bankStatement,
          status: "active",
          balanceETB: 100000, // Default balance
        },
      });

      await prisma.realBankAccount.create({
        data: {
          accountNumber: kycTemp.accountNumber,
          bankName: kycTemp.bankName,
          userId: userId,
        },
      });

      await sendEmail(user.email, user.fullName, true);

      await prisma.kYCTemp.delete({ where: { userId } });

      return res.status(200).json({
        message: "User status updated successfully, approval email sent, and account created.",
        user: updatedUser,
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          status: "rejected",
        },
      });

      await sendEmail(user.email, user.fullName, false);
      return res.status(200).json({ message: "User rejected, email sent." });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Failed to update user status", error });
  }
};


module.exports = { updateUserStatus, signIn}
