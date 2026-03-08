// config/db.js
const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    // ✅ recommended: use a single connection string in .env
    // MONGO_URI=mongodb+srv://user:pass@host/db?retryWrites=true&w=majority

    console.log("MONGO_DB_USER:", process.env.MONGO_URI);

    // const uri =
    //   process.env.MONGO_URI ||
    //   `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

    const uri =
      "mongodb+srv://kik2gether:6614380Ramifo!@cluster0.v4lyg.mongodb.net/kik2gether?retryWrites=true&w=majority";

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
