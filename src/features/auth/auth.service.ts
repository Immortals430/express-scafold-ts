import type {
  Login,
  SendAccountCreationOtp,
  VerifyCreatedAccount,
  VerifyPasswordReset,
} from "./auth.validator.js";
import UserRepository from "../user/user.repository.js";
import { ApplicationError } from "@/middleware/errorHandler.js";
import { comparePassword, hashPassword } from "@/utility/bcrypt.js";
import AuthCacheRepository from "./auth.cache.repository.js";
import { compare, hash } from "bcrypt";
import { createAccessToken, createRefreshToken } from "@/utility/jwt.js";
const isProduction = process.env.NODE_ENV === "production";


export default class AuthService {
  userRepository;
  authCache;
  constructor() {
    this.userRepository = new UserRepository();
    this.authCache = new AuthCacheRepository();
  }

  async sendCreateAccountOtp({
    email,
    username,
    password,
    confirmPassword,
  }: SendAccountCreationOtp) {
    if (password != confirmPassword) {
      throw new ApplicationError("Password must match confirm password", 405);
    }

    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      throw new ApplicationError(
        "User account already exist with this email address",
        409,
      );
    }

    const hashedPassword = await hashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hash(otp, 10);

    this.authCache.createCacheUserForAccountCreation({
      email,
      username,
      hashedPassword,
      hashedOtp,
    });

    if (!isProduction) console.log(otp);
    // send email
    // const resend = new Resend(EMAIL_API);

    // const mail = await resend.emails.send({
    //   from: "fromprojectimmortals@gmail.com",
    //   to: email,
    //   subject: "Otp for Account Creation",
    //   html: `<p>${otp}</p>`,
    // });

    return;
  }

  async verifyCreatedAccountOtp({ email, otp }: VerifyCreatedAccount) {
    const cacheUser =
      await this.authCache.getCacheUserForAccountCreation(email);

    if (!cacheUser) {
      throw new ApplicationError("Invalid or expired OTP", 400);
    }

    const isValidOtp = await compare(otp, cacheUser.hashedOtp);

    if (!isValidOtp) {
      throw new ApplicationError("Invalid OTP", 400);
    }

    await this.userRepository.createUser({
      email: cacheUser.email,
      password: cacheUser.hashedPassword,
      username: cacheUser.username,
    });

    await this.authCache.deleteCacheUserForAccountCreation(email);

    return;
  }

  async login({ email, password }: Login) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new ApplicationError("User not found", 404);
    }

    await comparePassword(password, user.password);

    const accessToken = createAccessToken({
      userId: user.id,
      email: user.email,
    });


    const refreshToken = await createRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const { password: noUse, ...userData } = user.toObject();

    return { accessToken, refreshToken, user: userData };
  }

  async sendPasswordResetOtp({ email }: { email: string }) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new ApplicationError("User not found", 404);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hash(otp, 10);

    this.authCache.createCacheUserForPasswordReset({
      email,
      hashedOtp,
    });

    if (!isProduction) console.log(otp);
    // send email
    return;
  }

  async verfiyPasswordResetOtp(userData: VerifyPasswordReset) {
    if (userData.password !== userData.confirmPassword) {
      throw new ApplicationError("Password must match confirm password", 405);
    }

    const cacheUser = await this.authCache.getCacheUserForPasswordReset(
      userData.email,
    );

    if (!cacheUser) {
      throw new ApplicationError("Invalid or expired OTP", 400);
    }

    const isValidOtp = await compare(userData.otp, cacheUser.hashedOtp);

    if (!isValidOtp) {
      throw new ApplicationError("Invalid OTP", 400);
    }

    const hashedPassword = await hashPassword(userData.password);

    await this.userRepository.updateUserPassword(
      userData.email,
      hashedPassword,
    );

    await this.authCache.deleteCacheUserForPasswordReset(userData.email);

    return;
  }

 
}
