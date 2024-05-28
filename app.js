require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
try {
  let db = process.env.DB_URL + process.env.DB_NAME;
  mongoose.connect(db).then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
} catch (e) {
  console.log("Failed to start server. Error: ", e);
}

module.exports = app;
