import { z } from "zod";

export const oldNewPasswordSchema = z.object({
  oldPassword: z.string().min(6, { message: "Incomplete length of old password should be more than 6 characters" }),
  newPassword: z.string().min(6, { message: "New password length should be more than 6 characters" }),
});
