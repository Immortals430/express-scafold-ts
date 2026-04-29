import redisClient from "@/config/redis.js";
export default class AuthCacheRepository {
  async getCacheUserForAccountCreation(email: string) {
    const userCreds = await redisClient.get(`createAccount:otp:${email}`);
    if (userCreds) return JSON.parse(userCreds);
    else return null;
  }

  async getCacheUserForPasswordReset(email: string) {
    const userCreds = await redisClient.get(`passwordReset:otp:${email}`);
    if (userCreds) return JSON.parse(userCreds);
    else return null;
  }

  async createCacheUserForAccountCreation(userData: {
    email: string;
    username: string;
    hashedPassword: string;
    hashedOtp: string;
  }) {
    return await redisClient.set(
      `createAccount:otp:${userData.email}`,
      JSON.stringify(userData),
      {
        expiration: {
          type: "PX",
          value: 5 * 60 * 1000,
        },
      },
    );
  }

  async createCacheUserForPasswordReset(userData: {
    email: string;
    hashedOtp: string;
  }) {
    return await redisClient.set(
      `passwordReset:otp:${userData.email}`,
      JSON.stringify(userData),
      {
        expiration: {
          type: "PX",
          value: 5 * 60 * 1000,
        },
      },
    );
  }

  async deleteCacheUserForAccountCreation(email: string) {
    return await redisClient.del(`createAccount:otp:${email}`);
  }

  async deleteCacheUserForPasswordReset(email: string) {
    return await redisClient.del(`passwordReset:otp:${email}`);
  }

}
