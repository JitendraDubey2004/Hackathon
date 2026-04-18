const express = require("express");
const { body } = require("express-validator");
const { apiKeyAuth, protect, authorizeRole } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct
} = require("../controllers/productController");

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  apiKeyAuth,
  protect,
  authorizeRole("admin"),
  [
    body("productId").notEmpty().withMessage("productId is required"),
    body("title").notEmpty().withMessage("title is required"),
    body("category").notEmpty().withMessage("category is required"),
    body("cost").isFloat({ min: 0 }).withMessage("cost must be >= 0"),
    body("taxPercent").optional().isFloat({ min: 0 }).withMessage("taxPercent must be >= 0"),
    body("stock").optional().isInt({ min: 0 }).withMessage("stock must be >= 0")
  ],
  validateRequest,
  createProduct
);
router.put(
  "/:id",
  apiKeyAuth,
  protect,
  authorizeRole("admin"),
  [
    body("title").optional().notEmpty().withMessage("title cannot be empty"),
    body("category").optional().notEmpty().withMessage("category cannot be empty"),
    body("cost").optional().isFloat({ min: 0 }).withMessage("cost must be >= 0"),
    body("taxPercent").optional().isFloat({ min: 0 }).withMessage("taxPercent must be >= 0"),
    body("stock").optional().isInt({ min: 0 }).withMessage("stock must be >= 0")
  ],
  validateRequest,
  updateProduct
);
router.delete("/:id", apiKeyAuth, protect, authorizeRole("admin"), deleteProduct);

module.exports = router;
