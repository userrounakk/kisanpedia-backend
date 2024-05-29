const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;

const plantsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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

plantsSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});
const Plant = mongoose.model("Plant", plantsSchema);
module.exports = Plant;
