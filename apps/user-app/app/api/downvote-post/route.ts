import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiError } from "../../../lib/ApiError";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../lib/ApiResponse";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json(
            new ApiError(400, "No user found try logging in again"),
            {
                status: 400,
            }
        );
    }
    const { postId }: { postId: string } = await request.json();
    if (!postId) {
        return Response.json(new ApiError(400, "Provide a valid post id in the request body"), {
            status: 400
        });
    }
    const postFromDB = await prisma.post.findFirst({
        where: {
            id: postId
        },
        select: {
            id: true,
            Upvotes: {
                select: {
                    userId: true
                }
            },
            Downvotes: {
                select: {
                    userId: true
                }
            }
        }
    });
    if (!postFromDB) {
        return Response.json(new ApiError(400, "Post is not found"), {
            status: 400
        });
    }
    const userUpvotedPost = await prisma.upvotes.findFirst({
        where: {
            AND: [
                {
                    userId: session.user.id || ""
                },
                {
                    postId: postFromDB.id
                }
            ]
        }
    });
    // Upvote is present so return
    if (userUpvotedPost) {
        return Response.json(new ApiError(400, "The post is upvoted remove that first"), {
            status: 400
        })
    }
    const userDownvotedPost = await prisma.downvotes.findFirst({
        where: {
            AND: [
                {
                    userId: session.user.id || ""
                },
                {
                    postId: postFromDB.id
                }
            ]
        }
    });

    // Downvotes is present so remove it
    if (userDownvotedPost) {
        await prisma.downvotes.deleteMany(
            {
                where: {
                    AND: [
                        {
                            userId: session.user.id
                        },
                        {
                            postId: postFromDB.id
                        }
                    ]
                }
            }
        )
        return Response.json(new ApiResponse(200, "Downvote removed", {}), { status: 200 })
    } else {
        await prisma.downvotes.create({
            data: {
                userId: session.user.id || "",
                postId: postFromDB.id
            }
        })
        return Response.json(new ApiResponse(200, "Downvoted the post", {}), { status: 200 })
    }
}
