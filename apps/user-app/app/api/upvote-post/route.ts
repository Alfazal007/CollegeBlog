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
    console.log(postFromDB)
    if (!postFromDB) {
        return Response.json(new ApiError(400, "Post is not found"), {
            status: 400
        });
    }
    const userDislikedPost = await prisma.downvotes.findFirst({
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
    // Downvote is present so return
    if (userDislikedPost) {
        return Response.json(new ApiError(400, "The post is downvoted remove that first"), {
            status: 400
        })
    }
    const userLikedPost = await prisma.upvotes.findFirst({
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

    // Upvotes is present so remove it
    if (userLikedPost) {
        await prisma.upvotes.deleteMany(
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
        return Response.json(new ApiResponse(200, "Upvote removed", {}), { status: 200 })
    } else {
        await prisma.upvotes.create({
            data: {
                userId: session.user.id || "",
                postId: postFromDB.id
            }
        })
        return Response.json(new ApiResponse(200, "Upvoted the post", {}), { status: 200 })
    }
}
