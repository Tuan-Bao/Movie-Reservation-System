import express from "express";
import * as reservationController from "../controllers/reservationController.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", reservationController.getAllReservations);
router.get("/:id", reservationController.getReservationById);
router.get("/user", authentication, reservationController.getReservationByUser);
router.post(
  "/",
  authentication,
  authorization(["admin"]),
  reservationController.createReservation
);
router.patch(
  "/:id",
  authentication,
  authorization(["admin"]),
  reservationController.updateReservation
);
router.delete(
  "/:id",
  authentication,
  authorization(["admin"]),
  reservationController.deleteReservation
);
router.post(
  "/:id/cancel",
  authentication,
  reservationController.cancelReservation
);
router.post(
  "/:id/amount",
  authentication,
  reservationController.calculateReservationAmount
);

export default router;
