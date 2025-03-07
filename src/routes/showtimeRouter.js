import express from "express";
import * as showtimeController from "../controllers/showtimeController.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", showtimeController.getAllShowtimes);
router.get("/:id", showtimeController.getShowTimeById);
router.get("/movies/:title", showtimeController.getShowTimesByMovieTitle);
router.post(
  "/",
  authentication,
  authorization(["admin"]),
  showtimeController.createShowTime
);
router.patch(
  "/:id",
  authentication,
  authorization(["admin"]),
  showtimeController.updateShowTime
);
router.delete(
  "/:id",
  authentication,
  authorization(["admin"]),
  showtimeController.deleteShowTime
);
router.post(
  "/:id/revenue",
  authentication,
  authorization(["admin"]),
  showtimeController.calculateShowtimeRevenue
);

export default router;
