import express from "express";
import * as userController from "../controllers/userController.js";
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", authentication, userController.getUserProfile);
router.get(
  "/users",
  authentication,
  authorization(["admin"]),
  userController.getAllUsers
);
router.get(
  "/users/:id",
  authentication,
  authorization(["admin"]),
  userController.getUserById
);
router.patch("/:id", authentication, userController.updateUser);
router.delete(
  "/:id",
  authentication,
  authorization(["admin"]),
  userController.deleteUser
);
router.get("/verify", userController.verifyOTP);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

export default router;
