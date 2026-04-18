const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI not set. Starting API without database connection.");
    return;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined
  });

  console.log("MongoDB connected");
}

module.exports = connectDB;
