const express = require("express");
const { body } = require("express-validator");
const { apiKeyAuth, protect, authorizeRole } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  listAllOrders,
  listMyOrders,
  placeOrder,
  quickReorder
} = require("../controllers/orderController");

const router = express.Router();

router.post(
  "/",
  apiKeyAuth,
  protect,
  authorizeRole("user"),
  [
    body("items").isArray({ min: 1 }).withMessage("Order requires items"),
    body("items.*.productId").notEmpty().withMessage("productId is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("quantity must be at least 1")
  ],
  validateRequest,
  placeOrder
);

router.get("/", apiKeyAuth, protect, authorizeRole("user"), listMyOrders);
router.post("/:id/reorder", apiKeyAuth, protect, authorizeRole("user"), quickReorder);

router.get("/admin/all", apiKeyAuth, protect, authorizeRole("admin"), listAllOrders);

module.exports = router;
