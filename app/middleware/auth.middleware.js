const { verifyToken } = require("../../helpers/token.helper");
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

const getUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: {
        type: "Unauthorized",
        content: "Please login to access this resource.",
      },
    });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: {
        type: "Unauthorized",
        content: "Token is invalid or expired. Please login again to continue.",
      },
    });
  }
  const user = await User.findById(decoded.id);
  req.user = user;
  next();
};

const isSuperAdmin = async (req, res, next) => {
  const user = req.user;
  console.log(user.role);
  if (user.role != "superadmin") {
    return res.status(401).json({
      success: false,
      message: {
        type: "Unauthorized",
        content: "You are not authorized to perform this action.",
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
  getUser,
  isSuperAdmin,
};
