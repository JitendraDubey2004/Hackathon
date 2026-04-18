const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { seedDefaultAdmin } = require("./services/seedAdminService");
const { seedCatalog } = require("./services/seedCatalogService");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "retail-portal-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Retail Portal API is running",
    health: "/api/health",
    docsHint: "Use /api/* endpoints"
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "Retail Portal API base",
    health: "/api/health"
  });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();
    await seedDefaultAdmin();
    await seedCatalog();

    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start API:", error.message);
    process.exit(1);
  }
}

startServer();
