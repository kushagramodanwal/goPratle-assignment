// Handles the connection to MongoDB.
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1); // Stop the server if the database connection fails.
  }
};

module.exports = connectDB;
