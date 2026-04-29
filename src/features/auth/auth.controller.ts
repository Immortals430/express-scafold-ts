import type { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service.js";
const PROJECT_NAME = process.env.PROJECT_NAME || "socially";
const isProduction = process.env.NODE_ENV === "production";

export default class AuthController {
  authService;
  constructor() {
    this.authService = new AuthService();
  }

  // send otp for account creation
  async sendCreateAccountOtp(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.sendCreateAccountOtp(req.body);
      res.status(200).json({ success: true, message: "Otp sent successfully" });
    } catch (error) {
      next(error);
    }
  }

  // verify otp for account creation
  async verifyCreatedAccountOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.authService.verifyCreatedAccountOtp(req.body);
      res
        .status(200)
        .json({ success: true, message: "Account created successfully" });
    } catch (error) {
      next(error);
    }
  }

  // login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken, user } = await this.authService.login(
        req.body,
      );

      res
        .status(200)
        .cookie(PROJECT_NAME, refreshToken, {
          httpOnly: true,
          secure: isProduction ? true : false,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .setHeader("Authorization", `Bearer ${accessToken}`)
        .json({ success: true, message: "Logged in successfully", data: user });
    } catch (error) {
      next(error);
    }
  }

  // send otp for password reset
  async sendPasswordResetOtp(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.sendPasswordResetOtp(req.body);
      res.status(200).json({ success: true, message: "Otp sent successfully" });
    } catch (error) {
      next(error);
    }
  }

  // verify otp for password reset
  async verfiyPasswordResetOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.authService.verfiyPasswordResetOtp(req.body);
      res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  }

  // logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.headers["authorization"]?.replace("Bearer ", "") || "";

      res
        .status(200)
        .clearCookie(PROJECT_NAME, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "none",
        })
        .setHeader("Authorization", "")
        .json({
          success: true,
          message: "Logged out successfully",
        });
    } catch (error) {
      next(error);
    }
  }
}
