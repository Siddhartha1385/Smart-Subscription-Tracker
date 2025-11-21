import express from "express";
import authMiddleware from "../middlewares/authmiddleware.js"; // Fixed import name
import {
  createSubscription,
  getallSubscriptions,
  updateSubscription,
  deleteSubscription,
  renewSubscription
} from "../controllers/subscriptioncontroller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSubscription);
router.get("/", getallSubscriptions);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);
router.post("/:id/renew", renewSubscription);

export default router;