const Store = require("../../models/Store");

const create = async (req, res) => {
  const { name, city, street, address, mapInfo } = req.body;
  try {
    const store = new Store({ name, city, street, address, mapInfo });
    await store.save();
    if (store) {
      res.status(201).json({
        success: true,
        message: {
          type: "Success",
          content: "Store added successfully.",
        },
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error creating store. Error: " + e,
      },
    });
  }
};

const index = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json({
      success: true,
      data: stores,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error Fetching stores. Error: " + e,
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
        content: "Store ID is required.",
      },
    });
  }
  const { name, city, street, address, mapInfo } = req.body;
  if (!name && !city && !street && !address && !mapInfo) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Please provide detail to update.",
      },
    });
  }
  try {
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Store not found.",
        },
      });
    }
    if (name) store.name = name;
    if (city) store.city = city;
    if (street) store.street = street;
    if (address) store.address = address;
    if (mapInfo) store.mapInfo = mapInfo;
    await store.save();
    res.status(200).json({
      success: true,
      message: {
        type: "Success",
        content: "Store updated successfully.",
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error updating store. Error: " + e,
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
        content: "Store ID is required.",
      },
    });
  }
  try {
    let store = await Store.findByIdAndDelete(id);
    if (!store)
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Store not found.",
        },
      });
    res.status(200).json({
      success: true,
      message: {
        type: "Success",
        content: "Store deleted successfully.",
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error deleting store. Error: " + e,
      },
    });
  }
};

module.exports = { create, index, edit, destroy };
