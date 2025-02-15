import express from "express";
import {
  deleteWithdrawalRequest,
  getAllUsers,
  getAllWalletRequests,
  getUserById,
  handleWithdrawalRequest,
  sendMoney,
  sendWithdrawalRequest,
  updateUserDetails,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.route("/allUsers").get(getAllUsers);
router.route("/user/:userId").get(getUserById);
router.route("/user/update/:userId").put(updateUserDetails);
router.route("/send/money").post(sendMoney);

///////////// Wallet Routes ///////////////

router.route("/wallet/allRequests").get(getAllWalletRequests);
router.route("/wallet/request/send").post(sendWithdrawalRequest);
router.route("/wallet/request/handle/:requestId").get(handleWithdrawalRequest);
router
  .route("/wallet/request/delete/:requestId")
  .delete(deleteWithdrawalRequest);

export default router;
