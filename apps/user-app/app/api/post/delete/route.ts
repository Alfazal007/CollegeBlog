import { getServerSession } from "next-auth";
import { ApiError } from "../../../../lib/ApiError";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../lib/ApiResponse";

export async function DELETE(
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
        const postToDelete = await prisma.post.findFirst({
            where: {
                id: params.postid,
            },
        });
        if (!postToDelete || postToDelete.creatorId != session.user.id) {
            return Response.json(
                new ApiError(
                    400,
                    "Either post not found or you are not post's creator"
                ),
                {
                    status: 400,
                }
            );
        }

        const updatedPost = await prisma.post.delete({
            where: {
                id: params.postid,
            },
        });
        if (!updatedPost) {
            return Response.json(new ApiError(500, "Could not delete post"), {
                status: 500,
            });
        }
        return Response.json(
            new ApiResponse(201, "Deleted post successfully", {}),
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);
        return Response.json(
            new ApiError(500, "Could not delete post try again later"),
            {
                status: 500,
            }
        );
    }
}
