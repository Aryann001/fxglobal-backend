import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Config the Env file
dotenv.config({
  path: "./src/config/config.env",
});

// Connecting the Database
connectDB();

// Listening to the APP
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT: ${process.env.PORT}`);
});
