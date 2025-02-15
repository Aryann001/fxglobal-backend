import mongoose from "mongoose";

const walletRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  amount: {
    type: Number,
  },
  userWalletId: {
    type: String,
  },
});

export default mongoose.model("WalletRequest", walletRequestSchema);
