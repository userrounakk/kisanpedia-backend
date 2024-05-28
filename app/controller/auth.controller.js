const { generateToken } = require("../../helpers/token.helper");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    if (user) {
      return res.status(201).json({
        success: true,
        message: {
          type: "Success",
          content: "User registered successfully.",
        },
      });
    }
    throw new Error("Failed to register user.");
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: e.message,
      },
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = generateToken(user);
        return res.status(200).json({
          success: true,
          message: {
            type: "Success",
            content: "User logged in successfully.",
          },
          token,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: {
            type: "Incorrect Password",
            content: "Please check your password and try again.",
          },
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content:
            "User not found. Please check your email address and try again.",
        },
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: e.message,
      },
    });
  }
};

module.exports = { register, login };
