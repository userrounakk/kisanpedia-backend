const { Router } = require("express");
const {
  existingEmail,
  hashPassword,
  registerValidate,
  loginValidate,
  getUser,
  isSuperAdmin,
  setPath,
} = require("../app/middleware/auth.middleware");

const {
  register,
  login,
  approveUser,
  updateRole,
  destroy,
  validateToken,
  listUsers,
} = require("../app/controller/auth.controller");
const uploader = require("../app/middleware/uploader.middleware");

const router = Router();

router.post(
  "/register",
  setPath,
  uploader.single("image"),
  registerValidate,
  existingEmail,
  hashPassword,
  register
);

router.get("/users", getUser, isSuperAdmin, listUsers);
router.post("/validate", validateToken);
router.post("/login", loginValidate, login);
router.put("/approve", getUser, isSuperAdmin, approveUser);
router.put("/makesuperadmin", getUser, isSuperAdmin, updateRole);
router.delete("/delete/:id", getUser, isSuperAdmin, destroy);

module.exports = router;
