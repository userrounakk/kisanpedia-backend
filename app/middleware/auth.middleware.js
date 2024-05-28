const User = require("../../models/user");
const bcrypt = require("bcrypt");

const registerValidate = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Missing Fields",
        content: "All fields are required.",
      },
    });
  }
  next();
};

const loginValidate = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Missing Fields",
        content: "All fields are required.",
      },
    });
  }
  next();
};

const generateHash = async (password) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const hashPassword = async (req, res, next) => {
  const { password } = req.body;
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
  if (!pattern.test(password)) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Weak Password",
        content:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      },
    });
  }
  req.body.password = await generateHash(password);
  next();
};

const existingEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Email Exists",
        content: "User with this email already exists.",
      },
    });
  }
  next();
};

const approvedUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user.approved) {
    return res.status(401).json({
      success: false,
      message: {
        type: "Unauthorized",
        content:
          "User is not approved yet. Contact an administrator for approval.",
      },
    });
  }
  next();
};

module.exports = {
  registerValidate,
  loginValidate,
  hashPassword,
  existingEmail,
  approvedUser,
};
