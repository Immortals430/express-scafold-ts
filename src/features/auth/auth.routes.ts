import express from "express";
import AuthController from "./auth.controller.js";
const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/signup/send-otp", (req, res, next) =>
  authController.sendCreateAccountOtp(req, res, next),
);

authRouter.post("/signup/verify-otp", (req, res, next) =>
  authController.verifyCreatedAccountOtp(req, res, next),
);

authRouter.post("/login", (req, res, next) =>
  authController.login(req, res, next),
);

authRouter.post("/forgot-password/send-otp", (req, res, next) =>
  authController.sendPasswordResetOtp(req, res, next),
);

authRouter.post("/forgot-password/verify-otp", (req, res, next) =>
  authController.verfiyPasswordResetOtp(req, res, next),
);

authRouter.post("/logout", (req, res, next) =>
  authController.logout(req, res, next),
);

export default authRouter;
