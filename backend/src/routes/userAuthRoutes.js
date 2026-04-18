const express = require("express");
const { body } = require("express-validator");
const { apiKeyAuth, protect, authorizeRole } = require("../middleware/authMiddleware");
const { getUserProfile, login, signup } = require("../controllers/userAuthController");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/signup",
  apiKeyAuth,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  signup
);

router.post(
  "/login",
  apiKeyAuth,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  login
);

router.get("/profile", apiKeyAuth, protect, authorizeRole("user"), getUserProfile);

module.exports = router;
