const Location = require("../../models/Location");

const validate = (req, res, next) => {
  const { location, type } = req.body;
  if (!location || !type) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Location and type are required fields.",
      },
    });
  }
  if (type != "City" && type != "District" && type != "Province") {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Type must be City, District, or Province.",
      },
    });
  }
  next();
};

const duplicate = async (req, res, next) => {
  const { location, type } = req.body;
  const existingLocation = await Location.findOne({ location, type });
  if (existingLocation) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Duplicate Location",
        content: "Location already exists.",
      },
    });
  }
  next();
};
module.exports = { validate, duplicate };
