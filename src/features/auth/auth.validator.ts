import { email, z } from "zod";

export const sendAccountCreationOtp = z.object({
  username: z.string("Username should be string"),
  email: z.email(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const verifyCreatedAccount = z.object({
  email: z.email(),
  otp: z.string(),
});

export const verifyPasswordReset = z.object({
  email: z.email(),
  otp: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export const login = z.object({
  email: z.email(),
  password: z.string(),
});

// export const registerUserZodSchema = z.union([
//   createUserZodSchema.extend(createAdminZodSchema.shape),
//   createUserZodSchema.extend(createWardenZodSchema.shape),
//   createUserZodSchema.extend(createStaffZodSchema.shape),
//   createUserZodSchema.extend(createTenantZodSchema.shape),
// ]);

export type SendAccountCreationOtp = z.infer<typeof sendAccountCreationOtp>;
export type VerifyCreatedAccount = z.infer<typeof verifyCreatedAccount>;
export type VerifyPasswordReset = z.infer<typeof verifyPasswordReset>;

export type Login = z.infer<typeof login>;
// export type RegisterUserBody = z.infer<typeof registerUserZodSchema>;
