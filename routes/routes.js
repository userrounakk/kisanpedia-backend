const { Router } = require("express");
const router = Router();
const auth = require("./auth.routes");
const plant = require("./plant.routes");
const location = require("./location.routes");
const seller = require("./seller.routes");
const store = require("./store.routes");

router.use("/auth", auth);
router.use("/stores", store);
router.use("/plants", plant);
router.use("/location", location);
router.use("/sellers", seller);

module.exports = router;
