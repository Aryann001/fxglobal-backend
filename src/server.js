import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import Finance from "./models/finance.model.js";

// Config the Env file
dotenv.config({
  path: "./src/config/config.env",
});

// Connecting the Database
connectDB();

// Field that updates every 24 hrs
app.get("/api/v1/run-cron", async (req, res) => {
  try {
    const finances = await Finance.find({});

    for (let singleUserFinance of finances) {
      if (singleUserFinance.directBusiness > 0) {
        const incrementValue =
          (0.07 * singleUserFinance.directBusiness) / 30;
        singleUserFinance.earned += incrementValue;

        await singleUserFinance.save({ validateBeforeSave: false });
      }
    }

    return res.status(200).json({ message: "Cron job executed successfully." });
  } catch (error) {
    console.error("Error updating earned field:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Listening to the APP
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT: ${process.env.PORT}`);
});
