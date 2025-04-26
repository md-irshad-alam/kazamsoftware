import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");

const connection = async () => {
  try {
    const db = await mongoose.connect(
      `mongodb+srv://${process.env.DB_URI_USER}:${process.env.DB_URI_PASS}@cluster0.eecjhwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log(
      `✅ MongoDB Connected: ${db.connection.host}/${db.connection.name}`
    );

    console.log("Connection established successfully.");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!");
    console.error(`Error: ${error}`);
    // throw new Error("MongoDB connection failed!");
  }
};

module.exports = connection;
