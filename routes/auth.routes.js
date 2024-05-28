const { Router } = require("express");
const {
  existingEmail,
  hashPassword,
  registerValidate,
  loginValidate,
} = require("../app/middleware/auth.middleware");

const { register, login } = require("../app/controller/auth.controller");

const router = Router();

router.post(
  "/register",
  registerValidate,
  existingEmail,
  hashPassword,
  register
);

router.post("/login", loginValidate, login);

module.exports = router;
