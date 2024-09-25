const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword } = require('../utils/passwordUtils');
const nodemailer = require('nodemailer')

const generateRandomPassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const sendEmail = async (email, username, temporaryPassword) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "exopain2930@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const subject = "Your Account Has Been Approved";
  const messageText = `Hello ${username},\n\nCongratulations! Your account has been approved. Your temporary password is: ${temporaryPassword}\n\nBest regards,\nIncluFi`;

  const mailOptions = {
    from: "nahom6297@gmail.com",
    to: email,
    subject: subject,
    text: messageText,
  };

  await transporter.sendMail(mailOptions);
};

const createAdmin = async (req, res) => {
  const { email, fullName } = req.body;
  const userId = req.user.id

  try {
    const temporaryPassword = generateRandomPassword();

    const hashedPassword = await hashPassword(temporaryPassword);

    const adminUser = await prisma.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        role: 'admin',
        creditScore: 100000,
        status: 'active',
      },
    });

    const realAccount = await prisma.realBankAccount.findFirst({
      where: { userId: parseInt(userId) },
    });

    if (!realAccount) {
      return res.status(404).json({ error: 'Real account not found for the provided user ID.' });
    }

    const adminConnection = await prisma.adminConn.create({
      data: {
        userId: adminUser.id,
        accountId: realAccount.id,
      },
    });

    await sendEmail(email, fullName, temporaryPassword);

    return res.status(201).json({
      adminUser,
      adminConnection,
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: 'An error occurred while creating the admin.' });
  }
};

module.exports = { createAdmin };
