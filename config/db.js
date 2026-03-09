// config/db.js
const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    // ✅ recommended: use a single connection string in .env
    // MONGO_URI=mongodb+srv://user:pass@host/db?retryWrites=true&w=majority

    console.log("MONGO_DB_USER:", process.env.MONGO_URI);

    const uri = process.env.MONGO_URI;

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
