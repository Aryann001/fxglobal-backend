import User from "../models/user.model.js";
import ApiHandler from "../utils/apiHandler.js";
import catchAsyncHanlder from "../utils/catchAsyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CAValidator from "cryptocurrency-address-validator";

export const register = catchAsyncHanlder(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    receiveAddress,
    referralCode,
  } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler(`User already exist`, 400));
  }

  if (!CAValidator.validate(receiveAddress, "BTC")) {
    return next(new ErrorHandler(`Enter a valid Receive Address`, 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler(`Passwords should be same`, 400));
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    receiveAddress,
    referralCode,
  });

  res
    .status(201)
    .json(new ApiHandler(201, newUser, "User successfully registered"));
});

export const login = catchAsyncHanlder(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(`Please enter email and password`, 400));
  }

  const user = await User.findOne({ email }).select("+password");


  if (!user) {
    return next(new ErrorHandler(`Invalid email and password`, 401));
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler(`Invalid email and password`, 401));
  }

  res.status(200).json(new ApiHandler(200, user, "Logged In success fully"));
});
