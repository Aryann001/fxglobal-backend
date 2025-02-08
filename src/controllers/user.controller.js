import User from "../models/user.model.js";
import Finance from "../models/finance.model.js";
import Team from "../models/team.model.js";
import ApiHandler from "../utils/apiHandler.js";
import catchAsyncHanlder from "../utils/catchAsyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CAValidator from "multicoin-address-validator";
import { generate } from "referral-codes";

export const register = catchAsyncHanlder(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    receiveAddress,
    referredBy,
  } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler(`User already exist`, 400));
  }

  if (!CAValidator.validate(receiveAddress, "bnb")) {
    return next(new ErrorHandler(`Enter a valid Receive Address`, 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler(`Passwords should be same`, 400));
  }

  const referralCode = generate({
    prefix: "FXGLOBAL",
  });

  const isReferredBy = await User.findOne({ referralCode: referredBy });

  if (!isReferredBy) {
    return next(new ErrorHandler(`Invalid Referral`, 400));
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    receiveAddress,
    referredBy,
    referralCode: referralCode[0],
  });

  await Finance.create({ userId: newUser._id });
  await Team.create({ userId: newUser._id });

  if (referredBy !== "") {
    const master = await User.aggregate([
      {
        $match: {
          referralCode: referredBy,
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
        },
      },
    ]);

    const masterTeam = await Team.findOne({ userId: master[0]._id });
    const masterFinance = await Finance.findOne({ userId: master[0]._id });

    masterTeam.members.push({
      memberId: newUser._id,
      firstName,
      lastName,
      email,
    });

    masterFinance.totalDirect = masterFinance.totalDirect + 1;

    await masterTeam.save({ validateBeforeSave: false });
    await masterFinance.save({ validateBeforeSave: false });
  }

  const nnewUser = await User.aggregate([
    {
      $match: {
        _id: newUser._id,
      },
    },
    {
      $lookup: {
        from: "finances",
        localField: "_id",
        foreignField: "userId",
        as: "finance",
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "_id",
        foreignField: "userId",
        as: "myTeam",
      },
    },
    {
      $addFields: {
        finance: {
          $first: "$finance",
        },
        myTeam: {
          $first: "$myTeam",
        },
      },
    },
  ]);

  return res
    .status(201)
    .json(new ApiHandler(201, nnewUser[0], "User successfully registered"));
});

export const login = catchAsyncHanlder(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(`Please enter email and password`, 400));
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler(`Invalid email and password`, 401));
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler(`Invalid email and password`, 401));
  }

  user = await User.aggregate([
    {
      $match: {
        _id: user._id,
      },
    },
    {
      $lookup: {
        from: "finances",
        localField: "_id",
        foreignField: "userId",
        as: "finance",
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "_id",
        foreignField: "userId",
        as: "myTeam",
      },
    },
    {
      $addFields: {
        finance: {
          $first: "$finance",
        },
        myTeam: {
          $first: "$myTeam",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiHandler(200, user[0], "Logged In success fully"));
});
