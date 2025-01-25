import PaymentRequest from "../models/paymentRequest.model.js";
import Finance from "../models/finance.model.js";
import User from "../models/user.model.js";
import catchAsyncHanlder from "../utils/catchAsyncHandler.js";
import Team from "../models/team.model.js";
import ApiHandler from "../utils/apiHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const sendRequest = catchAsyncHanlder(async (req, res, next) => {
  const { userId } = req.params;

  const requestExist = await PaymentRequest.findOne({ userId });

  if (requestExist) {
    return next(
      new ErrorHandler("Request is already sent. Wait for the response", 400)
    );
  }

  const { transactionId, plan } = req.body;

  const paymentRequestData = await PaymentRequest.create({
    userId,
    transactionId,
    package: plan,
  });

  return res
    .status(200)
    .json(
      new ApiHandler(
        200,
        paymentRequestData,
        "Payment Request sent successfully"
      )
    );
});

export const deleteRequest = catchAsyncHanlder(async (req, res) => {
  const { requestId } = req.params;

  const paymentRequestData = await PaymentRequest.findByIdAndDelete(requestId);

  return res
    .status(200)
    .json(
      new ApiHandler(200, paymentRequestData, "Payment Deleted successfully")
    );
});

export const getAllRequest = catchAsyncHanlder(async (req, res) => {
  const paymentRequests = await PaymentRequest.find();

  return res
    .status(200)
    .json(new ApiHandler(200, paymentRequests, "Payment Requests"));
});

export const handleRequest = catchAsyncHanlder(async (req, res) => {
  const { requestId } = req.params;

  let paymentRequestData = await PaymentRequest.findById(requestId);

  const user = await User.findByIdAndUpdate(
    paymentRequestData.userId,
    {
      package: paymentRequestData.package,
      packagePassed: true,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const userFinance = await Finance.findOne({ userId: user._id });

  userFinance.directBusiness =
    userFinance.directBusiness + paymentRequestData.package;

  userFinance.levelBusiness = userFinance.directBusiness;

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

  paymentRequestData = await PaymentRequest.findByIdAndDelete(requestId);

  return res
    .status(200)
    .json(
      new ApiHandler(
        200,
        paymentRequestData,
        "Payment Request sent successfully"
      )
    );
});
