import mongoose from "mongoose";

const paymentRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  transactionId: {
    type: String,
  },
  package: {
    type: Number,
    enum: [0, 200, 500, 3000, 5000, 10000, 20000],
  },
});

export default mongoose.model("PaymentRequest", paymentRequestSchema);
