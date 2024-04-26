import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../lib/ApiResponse";
import { ApiError } from "../../../../lib/ApiError";

export async function POST(request: Request) {
    const { username, email, password } = await request.json();
    console.log({ username });
    if (!username || !email || !password) {
        return Response.json(new ApiError(400, "Incomplete data given"), {
            status: 400,
        });
    }
    return Response.json(new ApiResponse(200, "Complete data given", {}), {
        status: 200,
    });
}
