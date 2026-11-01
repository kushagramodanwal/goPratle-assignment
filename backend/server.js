// This is where the app starts.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors()); // Allow the frontend (localhost:3000) to use the API.
app.use(express.json()); // Parse the request body as JSON.

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/requirements", require("./routes/requirementRoutes"));

// Connect to the database, then start the server.
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
