import { getServerSession } from "next-auth";
import { ApiError } from "../../../../../lib/ApiError";
import { authOptions } from "../../../auth/[...nextauth]/options";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../../lib/ApiResponse";

export async function GET(
    request: Request,
    { params }: { params: { postid: string } }
) {
    const postId = params.postid;
    if (!postId) {
        return Response.json(new ApiError(400, "Incomplete data provided"), {
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
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
            },
        });
        if (!post) {
            return Response.json(new ApiError(404, "Post not found"), {
                status: 404,
            });
        }
        return Response.json(new ApiResponse(200, "Found the post", post));
    } catch (error) {
        console.log(error);
        return Response.json(new ApiError(500, "Could not get post"), {
            status: 500,
        });
    }
}
