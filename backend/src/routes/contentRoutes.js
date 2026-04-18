const express = require("express");
const { getHomeContent } = require("../controllers/contentController");

const router = express.Router();

router.get("/home", getHomeContent);

module.exports = router;
