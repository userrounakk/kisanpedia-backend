const Location = require("../../models/Location");
const Plant = require("../../models/Plant");

const setPath = (req, res, next) => {
  req.dir = "public/uploads/plants";
  next();
};

const validate = async (req, res, next) => {
  const { name, price, location, description } = req.body;
  if (!name || !price || !location || !description) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "All fields are required",
      },
    });
  }
  if (isNaN(price)) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Price must be a number",
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

  try {
    await Promise.all(
      location.map(async (loc) => {
        const l = await Location.findById(loc);
        if (!l) {
          throw new Error("Invalid Location. Location not found");
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
  const { name } = req.body;
  const plant = await Plant.findOne({ name });
  if (plant) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Plant already exists",
      },
    });
  }
  next();
};

module.exports = { setPath, validate, duplicate };
