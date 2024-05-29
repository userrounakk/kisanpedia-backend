const { Router } = require("express");
const {
  validate,
  setPath,
  duplicate,
} = require("../app/middleware/plant.middleware");
const uploader = require("../app/middleware/uploader.middleware");
const {
  create,
  index,
  edit,
  addLocation,
  removeLocation,
  updateImage,
  destroy,
} = require("../app/controller/plant.controller");
const { getUser } = require("../app/middleware/auth.middleware");
const router = Router();

router.post(
  "/create",
  getUser,
  setPath,
  uploader.single("image"),
  validate,
  duplicate,
  create
);

router.get("/", index);
router.put("/edit/:id", getUser, edit);
router.put("/addlocation/:id", getUser, addLocation);
router.put("/removelocation/:id", getUser, removeLocation);
router.put(
  "/updateimage/:id",
  getUser,
  setPath,
  uploader.single("image"),
  updateImage
);
router.delete("/delete/:id", getUser, destroy);

module.exports = router;
