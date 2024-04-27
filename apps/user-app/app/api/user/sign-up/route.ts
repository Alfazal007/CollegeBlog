import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../lib/ApiResponse";
import { ApiError } from "../../../../lib/ApiError";
import { signUpSchema } from "@repo/zod/schema";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
        return Response.json(new ApiError(400, "Incomplete data given"), {
            status: 400,
        });
    }
    const isValid = signUpSchema.safeParse({
        username,
        email,
        password,
    });
    if (!isValid.success) {
        const errors = isValid.error.issues;
        let str = "";
        errors.forEach((err) => (str += `${err.message}  `));
        return Response.json(new ApiError(400, str), {
            status: 400,
        });
    }
    const indexOfAt = email.indexOf("@");
    const indexOfDot = email.indexOf(".");
    if (indexOfAt == -1 || indexOfDot == -1 || indexOfAt > indexOfDot) {
        return Response.json(new ApiError(400, "Invalid email given"), {
            status: 400,
        });
    }
    const collegeName = email.substring(indexOfAt + 1, indexOfDot);
    if (collegeName.length <= 3) {
        return Response.json(
            new ApiError(400, "Invalid email given or not of a college domain"),
            {
                status: 400,
            }
        );
    }
    // TODO:: password hashing algorithm
    const hashedPassword = await bcrypt.hash(password, 10);
    // TODO:: verify code and send email
    return Response.json(new ApiResponse(200, "Valid email given", {}), {
        status: 200,
    });
}
