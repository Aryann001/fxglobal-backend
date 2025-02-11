import express from "express";
import {
  getAllUsers,
  getUserById,
  sendMoney,
  updateUserDetails,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.route("/allUsers").get(getAllUsers);
router.route("/user/:userId").get(getUserById);
router.route("/user/update/:userId").put(updateUserDetails);
router.route("/send/money").post(sendMoney);

export default router;
