const { generateToken, verifyToken } = require("../../helpers/token.helper");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const fs = require("fs");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = false;
    if (req.file) {
      let filename =
        email.split(".")[0] + "." + req.file.filename.split(".")[1];
      fs.rename(
        req.file.path,
        req.file.destination + "/" + filename,
        function (err) {
          if (err) {
            throw new Error("Error renaming file. Error: " + err);
          }
        }
      );
      const image = filename;
      user = new User({ name, email, password, image });
    } else {
      user = new User({ name, email, password });
    }
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
      if (!user.approved) {
        return res.status(401).json({
          success: false,
          message: {
            type: "Unauthorized",
            content:
              "You account has not been approved yet. Please contact an admin for approval.",
          },
        });
      }
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
          user: {
            name: user.name,
            role: user.role,
            image: `/images/users/${user.image}`,
          },
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

const approveUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide an email address.",
      },
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: {
        type: "Not Found",
        content: "User not found.",
      },
    });
  }
  if (user.approved) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Already Approved",
        content: "User is already approved.",
      },
    });
  }
  user.approved = true;
  await user.save();
  return res.status(200).json({
    success: true,
    message: {
      type: "Success",
      content: "User approved successfully.",
    },
  });
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role image approved");
    users.forEach((user) => {
      user.image = `/images/users/${user.image}`;
    });
    if (!users) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "No users found.",
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: {
        type: "Success",
        data: users,
      },
    });
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

const updateRole = async (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide an email address.",
      },
    });
  }
  if (role !== "superadmin" && role !== "admin") {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide a valid role.",
      },
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: {
        type: "Not Found",
        content: "User not found.",
      },
    });
  }
  if (user.role === "superadmin" && role === "superadmin") {
    return res.status(400).json({
      success: false,
      message: {
        type: "Already Super Admin",
        content: "User is already a super admin.",
      },
    });
  }
  if (user.role === "admin" && role === "admin") {
    return res.status(400).json({
      success: false,
      message: {
        type: "Already Admin",
        content: "User is already an admin.",
      },
    });
  }
  user.role = role;
  await user.save();
  return res.status(200).json({
    success: true,
    message: {
      type: "Success",
      content: `User is now ${role}.`,
    },
  });
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "User not found.",
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: {
        type: "Success",
        content: "User deleted successfully.",
      },
    });
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

const validateToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide a token.",
      },
    });
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token.");
    }
    return res.status(200).json({
      success: true,
      message: {
        type: "Success",
        content: "Token is valid.",
      },
    });
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: {
        type: "Unauthorized",
        content: "Token is invalid or expired.",
      },
    });
  }
};

module.exports = {
  register,
  login,
  updateRole,
  approveUser,
  destroy,
  validateToken,
  listUsers,
};
