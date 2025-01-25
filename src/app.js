import express from "express";
import errorMiddleware from "./middlewares/error.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Test response
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

import UserRoutes from "./routes/user.route.js";
import AdminRoutes from "./routes/admin.route.js";
import FinanceRoutes from "./routes/finance.route.js";

app.use("/api/v1", UserRoutes);
app.use("/api/v1", FinanceRoutes);
app.use("/api/v1/admin", AdminRoutes);

app.use(errorMiddleware);

export default app;
