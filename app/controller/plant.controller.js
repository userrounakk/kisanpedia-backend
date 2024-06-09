const Plant = require("../../models/Plant");
const Location = require("../../models/Location");

const fs = require("fs");
const { log } = require("console");
const create = async (req, res) => {
  const { name, price, location, description } = req.body;
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide an image",
      },
    });
  }
  try {
    let filename =
      name.toLowerCase().split(" ").join("-") +
      "." +
      req.file.filename.split(".")[1];
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
    const newPlant = new Plant({ name, image, price, location, description });
    await newPlant.save();
    return res.status(201).json({
      success: true,
      message: {
        type: "Plant added",
        content: "Plant Added successfully.",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error creating plant. Error: " + e,
      },
    });
  }
};
const index = async (req, res, next) => {
  try {
    const plants = await Plant.find().lean();
    let plantList = await Promise.all(
      plants.map(async (plant) => {
        let locationIds = plant.location;
        let locationDocs = await Location.find({ _id: { $in: locationIds } });
        let locations = locationDocs.map((loc) => loc.location);

        return {
          _id: plant._id,
          name: plant.name,
          image: "/images/plants/" + plant.image,
          price: plant.price,
          location: locations,
          description: plant.description,
        };
      })
    );
    return res.status(200).json({
      success: true,
      data: plantList,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error fetching plants. Error: " + e,
      },
    });
  }
};

const edit = async (req, res) => {
  const { name, price, description, location } = req.body;
  if (!name && !price && !description && !location) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide data to update",
      },
    });
  }
  const plantId = req.params.id;
  try {
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Plant not found",
        },
      });
    }
    if (name) plant.name = name;
    if (price) plant.price = price;
    if (description) plant.description = description;
    if (location) plant.location = location;

    await plant.save();
    return res.status(200).json({
      success: true,
      message: {
        type: "Plant Updated",
        content: "Plant data updated successfully",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error updating plant. Error: " + e,
      },
    });
  }
};

const updateImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide an image",
      },
    });
  }
  const plantId = req.params.id;
  if (!plantId) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide plant ID",
      },
    });
  }
  const plant = await Plant.findById(plantId);
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: {
        type: "Not Found",
        content: "Plant not found",
      },
    });
  }

  let filename =
    plant.name.toLowerCase().split(" ").join("-") +
    "." +
    req.file.filename.split(".")[1];
  fs.rename(
    req.file.path,
    req.file.destination + "/" + filename,
    function (err) {
      if (err) {
        throw new Error("Error renaming file. Error: " + err);
      }
    }
  );
  plant.image = filename;
  await plant.save();
  return res.status(200).json({
    success: true,
    message: {
      type: "Image Updated",
      content: "Image updated successfully",
    },
  });
};

const destroy = async (req, res) => {
  try {
    const plantId = req.params.id;
    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: {
          type: "Bad Request",
          content: "Please provide plant ID",
        },
      });
    }
    const plant = await Plant.findOneAndDelete({ _id: plantId });
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Plant not found",
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: {
        type: "Plant Deleted",
        content: "Plant deleted successfully",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error deleting plant. Error: " + e,
      },
    });
  }
};

const show = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Bad Request",
        content: "Please provide plant ID",
      },
    });
  }
  try {
    const plant = await Plant.findById(id).lean();
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Plant not found",
        },
      });
    }
    let locationIds = plant.location;
    let locationDocs = await Location.find({ _id: { $in: locationIds } });
    let locations = locationDocs.map((loc) => loc.location);
    return res.status(200).json({
      success: true,
      data: {
        _id: plant._id,
        name: plant.name,
        image: "/images/plants/" + plant.image,
        price: plant.price,
        location: locations,
        description: plant.description,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error fetching plant. Error: " + e,
      },
    });
  }
};

module.exports = {
  create,
  index,
  edit,
  updateImage,
  destroy,
  show,
};
