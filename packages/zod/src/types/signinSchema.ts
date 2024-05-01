import { z } from "zod";

export const signinSchema = z.object({
    identifier: z.string(),
    password: z.string().min(6, { message: "Keep password minimum 6 length" }),
});
