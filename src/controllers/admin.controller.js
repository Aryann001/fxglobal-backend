import mongoose from "mongoose";
import User from "../models/user.model.js";
import Finance from "../models/finance.model.js";
import WalletRequest from "../models/walletRequest.model.js";
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

  const isUserPackageAlreadyPassed = user.packagePassed;

  user.package = money;
  
  if (!isUserPackageAlreadyPassed) {
    user.packagePassed = true;
  }

  await user.save({ validateBeforeSave: false });

  const userFinance = await Finance.findOne({ userId: user._id });

  const oldUserLevelBusiness = userFinance.levelBusiness;

  userFinance.directBusiness = userFinance.directBusiness + money;

  userFinance.levelBusiness =
    userFinance.levelBusiness + userFinance.directBusiness;

  userFinance.activationDate = new Date();

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

    if (!isUserPackageAlreadyPassed) {
      masterFinance.levelBusiness =
        masterFinance.levelBusiness + userFinance.levelBusiness;

      masterFinance.activeDirect = masterFinance.activeDirect + 1;
    } else {

    masterFinance.levelBusiness =
      masterFinance.levelBusiness +
      userFinance.levelBusiness -
      oldUserLevelBusiness;
    }
    await masterFinance.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiHandler(200, user, "Money sent successfully"));
});

// //////// Wallet /////////////

export const getAllWalletRequests = catchAsyncHanlder(
  async (req, res, next) => {
    const requests = await WalletRequest.find({});

    return res.status(200).json(new ApiHandler(200, requests, "All Requests"));
  }
);

export const sendWithdrawalRequest = catchAsyncHanlder(
  async (req, res, next) => {
    const { userId, name, email, amount, userWalletId } = req.body;

    const requestExist = await WalletRequest.findOne({ userId });

    if (requestExist) {
      return next(
        new ErrorHandler("Request is already sent. Wait for the response", 400)
      );
    }

    const userFinance = await Finance.findOne({ userId });

    if (userFinance) {
      if (userFinance.earned < amount) {
        return next(new ErrorHandler("Insufficient Balance", 401));
      }
    }

    if (amount < 20) {
      return next(
        new ErrorHandler("Withdrawal amount should be more than 20 USDT", 400)
      );
    }

    const request = await WalletRequest.create({
      userId,
      name,
      email,
      amount,
      userWalletId,
    });

    return res
      .status(201)
      .json(
        new ApiHandler(
          201,
          request,
          "Withdrawal Request has been sent successfully"
        )
      );
  }
);

export const deleteWithdrawalRequest = catchAsyncHanlder(async (req, res) => {
  const { requestId } = req.params;

  const walletRequestData = await WalletRequest.findByIdAndDelete(requestId);

  return res
    .status(200)
    .json(
      new ApiHandler(200, walletRequestData, "Payment Deleted successfully")
    );
});

export const handleWithdrawalRequest = catchAsyncHanlder(async (req, res) => {
  const { requestId } = req.params;

  let walletRequestData = await WalletRequest.findById(requestId);

  if (!walletRequestData) {
    return next(new ErrorHandler("Invalid Request ID", 400));
  }

  const userFinance = await Finance.findOne({
    userId: walletRequestData.userId,
  });

  if (walletRequestData.amount < userFinance.earned) {
    userFinance.earned = userFinance.earned - walletRequestData.amount;

    userFinance.withdraw = userFinance.withdraw + walletRequestData.amount;

    await userFinance.save({ validateBeforeSave: false });
  }

  walletRequestData = await WalletRequest.findByIdAndDelete(requestId);

  return res
    .status(200)
    .json(
      new ApiHandler(
        200,
        walletRequestData,
        "Payment Request sent successfully"
      )
    );
});
