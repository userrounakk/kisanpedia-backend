const { Router } = require("express");
const router = Router();
const auth = require("./auth.routes");
const plant = require("./plant.routes");
const location = require("./location.routes");
const seller = require("./seller.routes");
const store = require("./store.routes");

router.get("/", (req, res) => {
  res.send("The Server is running.");
});
router.use("/auth", auth);
router.use("/stores", store);
router.use("/plants", plant);
router.use("/location", location);
router.use("/sellers", seller);
router.use("/", (req, res) => {
  return res.status(404).json({
    success: false,
    message: {
      type: "Not Found",
      content: "Route not found",
    },
  });
});

module.exports = router;
