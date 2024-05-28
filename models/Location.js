const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
  location: {
    type: String,
    required: true,
  },
});
const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
