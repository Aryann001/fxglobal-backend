import User from "../models/user.model.js";
import ApiHandler from "../utils/apiHandler.js";
import catchAsyncHanlder from "../utils/catchAsyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getAllUsers = catchAsyncHanlder(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json(new ApiHandler(200, users, "Get all users"));
});

export const getUserById = catchAsyncHanlder(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) return next(new ErrorHandler("Invalid user ID", 400));

  res.status(200).json(new ApiHandler(200, user, "User details"));
});

export const updateUserDetails = catchAsyncHanlder(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    directBusiness,
    levelBusiness,
    receiveAddress,
    referralCode,
  } = req.body;

  const { userId } = req.params;

  let user = await User.findById(userId);

  if (!user) return next(new ErrorHandler("Invalid user ID", 400));

  user = await User.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      email,
      directBusiness,
      levelBusiness,
      receiveAddress,
      referralCode,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json(new ApiHandler(200, user, "User Updated"));
});