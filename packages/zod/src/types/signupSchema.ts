import { z } from "zod";

export const signUpSchema = z.object({
    username: z
        .string()
        .min(2, "Username length too short (keep it more than 2 chars)")
        .max(20, "Less than 20 chars bro"),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Keep password minimum 6 length" }),
});
