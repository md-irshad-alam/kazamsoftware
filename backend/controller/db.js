const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const connection = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `✅ MongoDB Connected: ${db.connection.host}/${db.connection.name}`
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!");
    console.error(`Error: ${error}`);
    // throw new Error("MongoDB connection failed!");
  }
};

module.exports = connection;
