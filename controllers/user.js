const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const { hashPassword } = require("../utils/passwordUtils");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([
  { name: "idFile", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
]);

const submitKYC = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err });
    }

    const { fullName, address, phoneNumber, accountNumber, bankName, userId } = req.body;

    const idFile = req.files.idFile ? req.files.idFile[0].path : null;
    const bankStatement = req.files.bankStatement ? req.files.bankStatement[0].path : null;

    if (!idFile || !bankStatement) {
      return res.status(400).json({ message: "ID and bank statement files are required." });
    }

    try {
      await prisma.kYCTemp.create({
        data: {
          fullName,
          address,
          phoneNumber,
          idFile,
          bankStatement,
          accountNumber,
          bankName,
          userId: parseInt(userId),
        },
      });

      res.status(201).json({ message: "KYC submitted successfully." });
    } catch (error) {
      console.error("Error submitting KYC:", error);
      res.status(500).json({ message: "Failed to submit KYC", error });
    }
  });
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        status: "pending",
        creditScore: 100,
      },
    });

    res.status(201).json({
      message: "User registered successfully. Awaiting KYC approval.",
      user: {
        id: newUser.id,
        email: newUser.email,
        status: newUser.status,
        creditScore: newUser.creditScore,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register user", error });
  }
};


const fetchAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

const blockUser = async (req,res) => {
  const userId = parseInt(req.params.id);
  const user = await prisma.user.update({
    where:{
      id: userId,
    },
    data:{
      status: "blocked",
    }
  })
  res.status(200).json(user);
}

module.exports = { fetchAllUsers, registerUser, blockUser, submitKYC };
