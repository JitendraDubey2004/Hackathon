const express = require("express");
const { body } = require("express-validator");
const { apiKeyAuth, protect, authorizeRole } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", listCategories);
router.get("/:id", getCategoryById);

router.post(
  "/",
  apiKeyAuth,
  protect,
  authorizeRole("admin"),
  [
    body("categoryId").notEmpty().withMessage("categoryId is required"),
    body("name").notEmpty().withMessage("name is required")
  ],
  validateRequest,
  createCategory
);
router.put(
  "/:id",
  apiKeyAuth,
  protect,
  authorizeRole("admin"),
  [body("name").optional().notEmpty().withMessage("name cannot be empty")],
  validateRequest,
  updateCategory
);
router.delete("/:id", apiKeyAuth, protect, authorizeRole("admin"), deleteCategory);

module.exports = router;
