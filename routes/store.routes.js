const { Router } = require("express");
const {
  index,
  create,
  edit,
  destroy,
  show,
} = require("../app/controller/store.controller");
const { getUser } = require("../app/middleware/auth.middleware");
const { validate, duplicate } = require("../app/middleware/store.middleware");

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/create", getUser, validate, duplicate, create);
router.put("/edit/:id", getUser, edit);
router.delete("/delete/:id", getUser, destroy);

module.exports = router;
