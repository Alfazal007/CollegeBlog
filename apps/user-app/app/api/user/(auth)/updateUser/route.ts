import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { ApiError } from "../../../../../lib/ApiError";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../../lib/ApiResponse";
import bcrypt from "bcrypt";
import { oldNewPasswordSchema } from "@repo/zod/schema";

export async function POST(request: Request) {
    const params = await request.json();
    const { oldPassword, newPassword } = params;
    if (!oldPassword || !newPassword) {
        return Response.json(new ApiError(400, "Provide both old and new passwords"));
    }
    const isValid = oldNewPasswordSchema.safeParse({
        oldPassword,
        newPassword,
    });
    if (!isValid.success) {
        const errors = isValid.error.issues;
        let str = "";
        errors.forEach((err) => (str += `${err.message}  `));
        return Response.json(new ApiError(400, str), {
            status: 400,
        });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json(
            new ApiError(400, "No user found try logging in again"),
            {
                status: 400,
            }
        );
    }

    try {
        const userFromDb = await prisma.user.findFirst(
            {
                where: {
                    id: session.user.id
                }
            }
        );
        if (!userFromDb) {
            return Response.json(new ApiError(404, "No User found to be deleted"));
        }
        const checkPassword = await bcrypt.compare(oldPassword, userFromDb.password);
        if (!checkPassword) {
            return Response.json(new ApiError(400, "Incorrect old password"));
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                password: hashedNewPassword
            }
        });
        return Response.json(new ApiResponse(201, "Updated the user successfully", {}));
    } catch (error) {
        return Response.json(new ApiError(500, "There was an error trying to find the user in the DB"));
    }
}

