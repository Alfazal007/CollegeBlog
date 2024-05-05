import prisma from "@repo/db/client";
import { z } from "zod";
import { ApiError } from "../../../../../lib/ApiError";
import { ApiResponse } from "../../../../../lib/ApiResponse";

const queryStringValidator = z.object({
    username: z
        .string()
        .min(3, "Username length too short (keep it more than 2 chars)")
        .max(20, "Less than 20 chars bro"),
});
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const params = {
        username: searchParams.get("username"),
    };
    const isValidSchema = queryStringValidator.safeParse(params);
    if (!isValidSchema.success) {
        const errors = isValidSchema.error.format().username?._errors || [];
        return Response.json(
            new ApiResponse(
                200,
                errors.length > 0 ? errors.join(", ") : "Invalid query params",
                {}
            ),
            {
                status: 200,
            }
        );
    }
    const { username } = isValidSchema.data;
    try {
        const userFromDB = await prisma.user.findFirst({
            where: {
                username,
            },
        });
        if (!userFromDB) {
            return Response.json(
                new ApiResponse(200, "Username is available", {}),
                {
                    status: 200,
                }
            );
        } else {
            return Response.json(
                new ApiResponse(200, "Username is not available", {}),
                {
                    status: 200,
                }
            );
        }
    } catch (err) {
        return Response.json(
            new ApiError(500, "There was an unexpected error on server"),
            {
                status: 500,
            }
        );
    }
}
