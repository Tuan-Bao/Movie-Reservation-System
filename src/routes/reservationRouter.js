import express from "express";
import * as reservationController from "../controllers/reservationController.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

router.get(
  "/",
  authentication,
  authorization(["admin"]),
  reservationController.getAllReservations
);
router.get(
  "/:id",
  authentication,
  authorization(["admin"]),
  reservationController.getReservationById
);
router.get(
  "/user/history",
  authentication,
  reservationController.getReservationByUser
);
router.post("/", authentication, reservationController.createReservation);
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
  "/amount/:id",
  authentication,
  reservationController.calculateReservationAmount
);

export default router;
