import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@repo/db/client";
import { ApiError } from "../../../../lib/ApiError";
import { ApiResponse } from "../../../../lib/ApiResponse";

export async function UPDATE(request: Request) {
    const params = await request.json();
    if (!params.subject && !params.content) {
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
        const postToUpdate = await prisma.post.findFirst({
            where: {
                id: params.postId,
            },
        });
        if (!postToUpdate || postToUpdate.creatorId != session.user.id) {
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
        let dataToUpdate = {} as { subject?: string; content?: string };
        if (params.subject) {
            dataToUpdate.subject = params.subject;
        }
        if (params.content) {
            dataToUpdate.content = params.content;
        }
        const updatedPost = await prisma.post.update({
            where: {
                id: params.postId,
            },
            data: dataToUpdate,
        });
        if (!updatedPost) {
            return Response.json(new ApiError(500, "Could not update post"), {
                status: 500,
            });
        }
        return Response.json(
            new ApiResponse(201, "Updated post successfully", {}),
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);
        return Response.json(new ApiError(500, "Could not update post"), {
            status: 500,
        });
    }
}
