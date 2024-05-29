require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/routes");
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(process.cwd() + "/public/uploads"));
app.use("/", router);

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
