const fs = require("fs");
const Seller = require("../../models/Seller");
const Location = require("../../models/Location");
const Plant = require("../../models/Plant");

const create = async (req, res) => {
  const { name, location, phoneNumber, products, description } = req.body;
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: {
        type: "Validation Error",
        content: "Image is required",
      },
    });
  }
  try {
    let filename =
      name.toLowerCase().split(" ").join("-") +
      phoneNumber +
      "." +
      req.file.filename.split(".")[1];
    fs.rename(
      req.file.path,
      req.file.destination + "/" + filename,
      function (err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: {
              type: "Server Error",
              content: "Error renaming file. Error: " + err,
            },
          });
        }
      }
    );
    const imageUrl = filename;
    const newSeller = new Seller({
      name,
      imageUrl,
      location,
      phoneNumber,
      products,
      description,
    });
    await newSeller.save();
    return res.status(201).json({
      success: true,
      message: {
        type: "Seller added",
        content: "Seller Added successfully.",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error renaming file. Error: " + e,
      },
    });
  }
};

const index = async (req, res) => {
  try {
    const sellers = await Seller.find().lean();
    let sellerList = await Promise.all(
      sellers.map(async (seller) => {
        let locationIds = seller.location;
        let locationDocs = await Location.find({ _id: { $in: locationIds } });
        let locations = locationDocs.map((loc) => loc.location);
        let productIds = seller.products;
        let productDocs = await Plant.find({ _id: { $in: productIds } });
        let products = productDocs.map((pro) => pro.name);

        return {
          _id: seller._id,
          name: seller.name,
          image: "/images/sellers/" + seller.imageUrl,
          price: seller.price,
          location: locations,
          products: products,
          description: seller.description,
          phoneNumber: seller.phoneNumber,
        };
      })
    );
    return res.status(200).json({
      success: true,
      data: sellerList,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error fetching sellers. Error: " + e,
      },
    });
  }
};

const edit = async (req, res) => {
  try {
    const { name, products, location, phoneNumber, description } = req.body;
    if (!name && !phoneNumber && !description) {
      return res.status(400).json({
        success: false,
        message: {
          type: "Validation Error",
          content: "Please provide data to update",
        },
      });
    }
    const sellerId = req.params.id;
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: {
          type: "Validation Error",
          content: "Seller ID is required",
        },
      });
    }
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Seller not found",
        },
      });
    }
    if (name) seller.name = name;
    if (phoneNumber) seller.phoneNumber = phoneNumber;
    if (description) seller.description = description;
    if (products) seller.products = products;
    if (location) seller.location = location;

    await seller.save();
    return res.status(200).json({
      success: true,
      message: {
        type: "Seller Updated",
        content: "Seller data updated successfully",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error updating seller. Error: " + e,
      },
    });
  }
};

const editImage = async (req, res) => {
  try {
    const sellerId = req.params.id;
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: {
          type: "Validation Error",
          content: "Seller ID is required",
        },
      });
    }
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Seller not found",
        },
      });
    }
    if (!req.file) {
      throw new Error("Error renaming file. Error: " + err);
    }
    let filename =
      seller.name.toLowerCase().split(" ").join("-") +
      seller.phoneNumber +
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
    seller.imageUrl = filename;
    await seller.save();
    return res.status(200).json({
      success: true,
      message: {
        type: "Seller Updated",
        content: "Seller image updated successfully",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error updating seller image. Error: " + e,
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
        content: "Please provide seller ID",
      },
    });
  }
  try {
    const seller = await Seller.findById(id).lean();
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Seller not found",
        },
      });
    }
    let locationIds = seller.location;
    let locations = await Location.find({ _id: { $in: locationIds } });
    let productIds = seller.products;
    let products = await Plant.find({ _id: { $in: productIds } });
    return res.status(200).json({
      success: true,
      data: {
        _id: seller._id,
        name: seller.name,
        image: "/images/sellers/" + seller.imageUrl,
        price: seller.price,
        location: locations,
        products: products,
        description: seller.description,
        phoneNumber: seller.phoneNumber,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error fetching seller. Error: " + e,
      },
    });
  }
};

const destroy = async (req, res) => {
  try {
    const sellerId = req.params.id;
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: {
          type: "Bad Request",
          content: "Please provide seller ID",
        },
      });
    }
    const seller = await Seller.findOneAndDelete({ _id: sellerId });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: {
          type: "Not Found",
          content: "Seller not found",
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: {
        type: "Seller Deleted",
        content: "Seller deleted successfully",
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error deleting seller. Error: " + e,
      },
    });
  }
};

module.exports = {
  create,
  index,
  edit,
  editImage,
  show,
  destroy,
};
