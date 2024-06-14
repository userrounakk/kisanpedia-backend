const { Router } = require("express");
const { getUser } = require("../app/middleware/auth.middleware");
const {
  setPath,
  validate,
  duplicate,
} = require("../app/middleware/seller.middleware");
const uploader = require("../app/middleware/uploader.middleware");
const {
  create,
  index,
  edit,
  editImage,
  destroy,
  show,
} = require("../app/controller/seller.controller");
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
router.get("/:id", show);
router.put("/edit/:id", getUser, edit);
router.put(
  "/updateimage/:id",
  getUser,
  setPath,
  uploader.single("image"),
  editImage
);
router.delete("/delete/:id", getUser, destroy);

module.exports = router;
