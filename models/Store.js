const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mapInfo: {
    type: String,
    required: true,
  },
});
