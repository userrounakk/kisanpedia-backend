const { Router } = require("express");
const {
  index,
  create,
  edit,
  destroy,
} = require("../app/controller/location.controller");
const {
  validate,
  duplicate,
} = require("../app/middleware/location.middleware");
const { getUser } = require("../app/middleware/auth.middleware");
const router = Router();

router.get("/", index);
router.post("/create", getUser, validate, duplicate, create);
router.put("/edit/:id", getUser, edit);
router.delete("/delete/:id", getUser, destroy);

module.exports = router;
