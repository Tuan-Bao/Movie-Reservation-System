import express from "express";
import * as seatController from "../controllers/seatController.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", seatController.getAllSeats);
router.get("/:id", seatController.getSeatById);
router.post(
  "/",
  authentication,
  authorization(["admin"]),
  seatController.createSeat
);
router.patch(
  "/:id",
  authentication,
  authorization(["admin"]),
  seatController.updateSeat
);
router.delete(
  "/:id",
  authentication,
  authorization(["admin"]),
  seatController.deleteSeat
);

export default router;
