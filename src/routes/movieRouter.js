import express from "express";
import * as movieController from "../controllers/movieController.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);
router.post(
  "/",
  authentication,
  authorization(["admin"]),
  movieController.createMovie
);
router.patch(
  "/:id",
  authentication,
  authorization(["admin"]),
  movieController.updateMovie
);
router.delete(
  "/:id",
  authentication,
  authorization(["admin"]),
  movieController.deleteMovie
);
router.post(
  "/:id/revenue",
  authentication,
  authorization(["admin"]),
  movieController.calculateMovieRevenue
);

export default router;
