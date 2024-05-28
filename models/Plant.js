const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const plantsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: [ObjectId],
    ref: "Location",
  },
  description: {
    type: String,
    required: true,
  },
});
const Plant = mongoose.model("Plant", plantsSchema);
module.exports = Plant;
