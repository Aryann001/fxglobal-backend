import mongoose from "mongoose";
import User from "../models/user.model.js";
import Finance from "../models/finance.model.js";
import ApiHandler from "../utils/apiHandler.js";
import catchAsyncHanlder from "../utils/catchAsyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getAllUsers = catchAsyncHanlder(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json(new ApiHandler(200, users, "Get all users"));
});

export const getUserById = catchAsyncHanlder(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) return next(new ErrorHandler("Invalid user ID", 400));

  const compareObjId = new mongoose.Types.ObjectId(userId);

  const user = await User.aggregate([
    {
      $match: {
        _id: compareObjId,
      },
    },
    // {
    //   $lookup: {
    //     from: "finances",
    //     localField: "_id",
    //     foreignField: "userId",
    //     as: "finance",
    //   },
    // },
    // {
    //   $addFields: {
    //     finance: {
    //       $first: "$finance",
    //     },
    //   },
    // },
  ]);
  // console.log(user);

  if (!user?.length)
    return next(new ErrorHandler("Invalid user ID or user not exist", 400));

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

export const sendMoney = catchAsyncHanlder(async (req, res, next) => {
  const { email, money } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not exist", 400));
  }

  user.package = money;
  user.packagePassed = true;

  await user.save({ validateBeforeSave: false });

  const userFinance = await Finance.findOne({ userId: user._id });

  userFinance.directBusiness = userFinance.directBusiness + money;

  userFinance.levelBusiness =
    userFinance.levelBusiness + userFinance.directBusiness;

  await userFinance.save({ validateBeforeSave: false });

  if (user.referredBy !== "") {
    const master = await User.aggregate([
      {
        $match: {
          referralCode: user.referredBy,
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
        },
      },
    ]);

    const masterFinance = await Finance.findOne({ userId: master[0]._id });

    masterFinance.levelBusiness =
      masterFinance.levelBusiness + userFinance.levelBusiness;

    masterFinance.activeDirect = masterFinance.activeDirect + 1;

    await masterFinance.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiHandler(200, user, "Money sent successfully"));
});
