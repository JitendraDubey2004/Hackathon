const express = require("express");
const { body } = require("express-validator");
const { apiKeyAuth, protect, authorizeRole } = require("../middleware/authMiddleware");
const { getProfile, loginAdmin, registerAdmin } = require("../controllers/authController");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  apiKeyAuth,
  protect,
  authorizeRole("admin"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  registerAdmin
);

router.post(
  "/login",
  apiKeyAuth,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  loginAdmin
);

router.get("/profile", apiKeyAuth, protect, getProfile);
router.get("/", apiKeyAuth, protect, getProfile);

module.exports = router;
