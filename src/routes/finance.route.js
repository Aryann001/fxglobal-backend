import express from "express";
import {
  deleteRequest,
  getAllRequest,
  handleRequest,
  sendRequest,
} from "../controllers/finance.controller.js";

const router = express.Router();

router.route("/request/delete/:requestId").delete(deleteRequest);

router.route("/request/all").get(getAllRequest);

router.route("/request/send/:userId").post(sendRequest);

router.route("/request/handle/:requestId").get(handleRequest);

export default router;
