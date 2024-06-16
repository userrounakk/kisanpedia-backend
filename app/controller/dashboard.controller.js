const Location = require("../../models/Location");
const Seller = require("../../models/Seller");
const Plant = require("../../models/Plant");
const Store = require("../../models/Store");
const dashboardContent = async (req, res) => {
  try {
    const sellersCount = await Seller.countDocuments();
    const plantsCount = await Plant.countDocuments();
    const locationsCount = await Location.countDocuments();
    const storeCount = await Store.countDocuments();

    const recentSellers = await Seller.find().sort({ _id: -1 }).limit(5);
    const recentPlants = await Plant.find().sort({ _id: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      data: {
        sellersCount,
        plantsCount,
        locationsCount,
        storeCount,
        recentSellers,
        recentPlants,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: {
        type: "Server Error",
        content: "Error Fetching Dashboard Content. Error: " + e,
      },
    });
  }
};
module.exports = dashboardContent;
