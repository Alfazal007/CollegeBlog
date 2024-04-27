import prisma from "@repo/db/client";
import { ApiError } from "../../../../../lib/ApiError";
import { ApiResponse } from "../../../../../lib/ApiResponse";

export async function POST(request: Request) {
    const { username, code } = await request.json();
    if (!username || !code) {
        return Response.json(
            new ApiError(400, "Provide all necessary components"),
            {
                status: 400,
            }
        );
    }
    const decodedUsername = decodeURIComponent(username);
    try {
        const userFromDB = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });
        if (!userFromDB) {
            return Response.json(new ApiError(400, "User not found"), {
                status: 400,
            });
        }
        const isCodeValid = userFromDB.verifyCode === code;
        const isCodeNotExpired =
            new Date(userFromDB.verifyCodeExpiry) > new Date();
        if (isCodeValid && isCodeNotExpired) {
            await prisma.user.update({
                where: {
                    username,
                },
                data: {
                    isVerified: true,
                },
            });
            return Response.json(
                new ApiResponse(200, "User verified successfully", {}),
                {
                    status: 200,
                }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                new ApiError(400, "Sign in again as the code is expired"),
                {
                    status: 400,
                }
            );
        } else {
            return Response.json(
                new ApiError(400, "Verification code is not correct"),
                {
                    status: 400,
                }
            );
        }
    } catch (error) {
        return Response.json(
            new ApiError(
                500,
                "Some error verifying the user on the server end"
            ),
            {
                status: 500,
            }
        );
    }
}
