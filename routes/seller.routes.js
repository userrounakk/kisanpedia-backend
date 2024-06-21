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
  apply,
  approve,
  unapproved,
} = require("../app/controller/seller.controller");
const sellerUploader = require("../app/middleware/seller.uploader");
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
router.get("/unapproved", getUser, unapproved);
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
router.post(
  "/apply",
  sellerUploader.fields([
    { name: "products", maxCount: 5 },
    { name: "image", maxCount: 1 },
  ]),
  apply
);

router.put("/approve/:id", getUser, approve);

module.exports = router;
