const mongoose = require("mongoose");
const Field = require("../models/Field");
require("dotenv").config();

async function seedFields() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const fields = [
      { number: 1, name: "Field 1" },
      { number: 2, name: "Field 2" },
      { number: 3, name: "Field 3" },
      { number: 4, name: "Field 4" },
    ];

    for (const field of fields) {
      await Field.updateOne(
        { number: field.number },
        { $set: field },
        { upsert: true },
      );
    }

    console.log("Fields seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedFields();
