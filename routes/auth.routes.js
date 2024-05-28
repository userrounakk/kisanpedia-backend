const { Router } = require("express");
const {
  existingEmail,
  hashPassword,
  registerValidate,
  loginValidate,
  getUser,
  isSuperAdmin,
} = require("../app/middleware/auth.middleware");

const {
  register,
  login,
  approveUser,
  updateRole,
  destroy,
} = require("../app/controller/auth.controller");

const router = Router();

router.post(
  "/register",
  registerValidate,
  existingEmail,
  hashPassword,
  register
);

router.post("/login", loginValidate, login);
router.put("/approve", getUser, isSuperAdmin, approveUser);
router.put("/makesuperadmin", getUser, isSuperAdmin, updateRole);
router.delete("/delete/:id", getUser, isSuperAdmin, destroy);

module.exports = router;
