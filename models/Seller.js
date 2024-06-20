const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = require("mongodb");

const sellerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: [ObjectId],
    ref: "Location",
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  products: {
    type: [ObjectId],
    ref: "Plant",
  },
  description: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
});

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
