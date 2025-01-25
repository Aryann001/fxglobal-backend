import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const teamSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    members: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

teamSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Team", teamSchema);
