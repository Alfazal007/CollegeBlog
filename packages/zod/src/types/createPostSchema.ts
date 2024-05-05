import { z } from "zod";

export const createPostSchema = z.object({
    subject: z
        .string()
        .min(3, "Subject length too short (keep it more than 2 chars)")
        .max(30, "Less than 30 chars"),
    content: z.string(),
});
