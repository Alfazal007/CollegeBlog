import { z } from "zod";

export const createReplySchema = z.object({
    reply: z
        .string()
        .min(3, "Reply length too short (keep it more than 2 chars)")
});
