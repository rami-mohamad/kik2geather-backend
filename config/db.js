// config/db.js
const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
