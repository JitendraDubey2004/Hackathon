const express = require("express");
const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const userAuthRoutes = require("./userAuthRoutes");
const orderRoutes = require("./orderRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const contentRoutes = require("./contentRoutes");

const router = express.Router();

router.use("/admin", authRoutes);
router.use("/admin/categories", categoryRoutes);
router.use("/admin/products", productRoutes);
router.use("/admin", inventoryRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/auth", userAuthRoutes);
router.use("/orders", orderRoutes);
router.use("/content", contentRoutes);

module.exports = router;
