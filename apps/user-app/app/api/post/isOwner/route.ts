import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiError } from "../../../../lib/ApiError";
import { ApiResponse } from "../../../../lib/ApiResponse";
import prisma from "@repo/db/client";

export async function POST(request: Request) {
    const { postId } = await request.json();
    if (!postId) {
        return Response.json(new ApiError(400, "Incomplete data provided"), {
            status: 400,
        });
    }
    const session = await getServerSession(authOptions);
    console.log({ session });
    if (!session || !session.user) {
        return Response.json(
            new ApiError(400, "No user found try logging in again"),
            {
                status: 400,
            }
        );
    }
    try {
        const postFromDB = await prisma.post.findFirst({
            where: {
                id: postId
            },
            select: {
                id: true,
                creator: true
            }
        });
        if (!postFromDB) {
            return Response.json(new ApiError(404, "Post not found"), { status: 404 })
        }
        if (postFromDB.creator.id === session.user.id) {
            return Response.json(new ApiResponse(200, "You are the creator", { "isOwner": true }), { status: 200 })
        } else {
            return Response.json(new ApiResponse(200, "You are not the owner", { "isOwner": false }), { status: 200 })
        }
    } catch (err) {
        return Response.json(new ApiError(400, "There was an error checking the ownership of the post"), { status: 400 })
    }
}
