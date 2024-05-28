const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["City", "District", "Province"],
    required: true,
  },
});
const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
