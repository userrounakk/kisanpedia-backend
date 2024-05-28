const Location = require("../../models/Location");
const create = async (req, res) => {
  const { location, type } = req.body;
  try {
    const newLocation = new Location({ location, type });
    await newLocation.save();
    return res.status(201).json({
      success: true,
      message: {
        type: "Location added",
        content: "Location Added successfully.",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error creating location. Error: " + e,
      },
    });
  }
};

const index = async (req, res) => {
  try {
    const locations = await Location.find();
    return res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error Fetching locations. Error: " + e,
      },
    });
  }
};

const edit = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Location ID is required.",
      },
    });
  }
  const { location, type } = req.body;
  if (!location && !type) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Please provide detail to update.",
      },
    });
  }
  if (type) {
    if (type != "City" && type != "District" && type != "Province") {
      return res.status(400).json({
        success: false,
        message: {
          type: "Validation Error",
          content: "Type must be City, District, or Province.",
        },
      });
    }
  }
  try {
    const savedLocation = await Location.findById(id);
    if (location) savedLocation.location = location;
    if (type) savedLocation.type = type;
    await savedLocation.save();
    return res.status(200).json({
      success: true,
      message: {
        type: "Location updated",
        content: "Location updated successfully.",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error updating location. Error: " + e,
      },
    });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Location ID is required.",
      },
    });
  }
  try {
    let location = await Location.findByIdAndDelete(id);
    if (!location)
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Location not found.",
        },
      });
    return res.status(200).json({
      success: true,
      message: {
        type: "Location deleted",
        content: "Location deleted successfully.",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error deleting location. Error: " + e,
      },
    });
  }
};

module.exports = { create, index, edit, destroy };
