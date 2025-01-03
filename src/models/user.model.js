import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [2, "Minimum length of the first name is 2 character"],
      maxLength: [15, "Maximum length of the first name is 15 character"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [2, "Minimum length of the last name is 2 character"],
      maxLength: [15, "Maximum length of the last name is 15 character"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Minimum length of the Password is 8 character"],
      select: false,
    },
    receiveAddress: {
      type: String,
      required: [true, "Receive Address is required"],
    },
    referralCode: {
      type: String,
    },
    directBusiness: {
      type: Number,
      default: 0
    },
    levelBusiness: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
