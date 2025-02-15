import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cron from "node-cron";
import Finance from "./models/finance.model.js";

// Config the Env file
dotenv.config({
  path: "./src/config/config.env",
});

// Connecting the Database
connectDB();

// Field that updates every 24 hrs
cron.schedule("0 12 * * *", async () => {
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
  } catch (error) {
    console.error("Error updating field:", error);
  }
});

// Listening to the APP
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT: ${process.env.PORT}`);
});
