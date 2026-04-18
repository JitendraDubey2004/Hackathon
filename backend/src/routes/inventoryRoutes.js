const express = require("express");
const { body } = require("express-validator");
const { apiKeyAuth, protect, authorizeRole } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const { listStockHistory, updateProductStock } = require("../controllers/inventoryController");

const router = express.Router();

router.patch(
  "/products/:id/stock",
  apiKeyAuth,
  protect,
  authorizeRole("admin"),
  [body("stock").isInt({ min: 0 }).withMessage("stock must be a non-negative integer")],
  validateRequest,
  updateProductStock
);

router.get("/stock-history", apiKeyAuth, protect, authorizeRole("admin"), listStockHistory);

module.exports = router;
