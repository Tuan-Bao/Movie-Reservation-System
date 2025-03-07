import express from "express";
import * as theaterController from "../controllers/theaterController.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", theaterController.getAllTheaters);
router.get("/:id", theaterController.getTheaterById);
router.get("/:name/seats", theaterController.getSeatsByTheaterName);
router.post(
  "/",
  authentication,
  authorization(["admin"]),
  theaterController.createTheater
);
router.patch(
  "/:id",
  authentication,
  authorization(["admin"]),
  theaterController.updateTheater
);
router.delete(
  "/:id",
  authentication,
  authorization(["admin"]),
  theaterController.deleteTheater
);

export default router;
