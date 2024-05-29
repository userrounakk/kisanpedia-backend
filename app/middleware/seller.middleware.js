const Location = require("../../models/Location");
const Plant = require("../../models/Plant");
const Seller = require("../../models/Seller");
const setPath = (req, res, next) => {
  req.dir = "public/uploads/sellers";
  next();
};

const validate = async (req, res, next) => {
  const { name, location, phoneNumber, products, description } = req.body;
  if (!name || !location || !phoneNumber || !products || !description) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "All fields are required",
      },
    });
  }
  if (location.length < 1) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "At least one location is required",
      },
    });
  }
  if (products.length < 1) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "At least one product is required",
      },
    });
  }

  try {
    await Promise.all(
      location.map(async (loc) => {
        const l = await Location.findById(loc);
        if (!l) {
          throw new Error("Invalid Location. Location not found");
        }
      })
    );

    await Promise.all(
      products.map(async (prod) => {
        const p = await Plant.findById(prod);
        if (!p) {
          throw new Error("Invalid Product. Product not found");
        }
      })
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: error.message,
      },
    });
  }

  next();
};

const duplicate = async (req, res, next) => {
  const { name, phone } = req.body;
  const seller = await Seller.findOne({ name, phone });
  if (seller) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Seller already exists",
      },
    });
  }
  next();
};

module.exports = { setPath, validate, duplicate };
