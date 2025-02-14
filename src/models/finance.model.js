import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const financeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  directBusiness: {
    type: Number,
    default: 0,
  },
  activationDate: {
    type: Date,
  },
  levelBusiness: {
    type: Number,
    default: 0,
  },
  totalDirect: {
    type: Number,
    default: 0,
  },
  activeDirect: {
    type: Number,
    default: 0,
  },
  totalTeam: {
    type: Number,
    default: 0,
  },
  activeTeam: {
    type: Number,
    default: 0,
  },
  earned: {
    type: Number,
    default: 0,
  },
  withdraw: {
    type: Number,
    default: 0,
  },
  referralBonusEarning: {
    type: Number,
    default: 0,
  },
});

financeSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Finance", financeSchema);
