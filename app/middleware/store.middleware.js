const Store = require("../../models/Store");

const validate = (req, res, next) => {
  const { name, city, street, address, mapInfo } = req.body;
  if (!name || !city || !street || !address || !mapInfo) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "All fields are required.",
      },
    });
  }
  next();
};

const duplicate = async (req, res, next) => {
  const { name, city } = req.body;
  const store = await Store.findOne({ name, city });
  if (store) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Store already exists.",
      },
    });
  }
  next();
};
module.exports = { validate, duplicate };
