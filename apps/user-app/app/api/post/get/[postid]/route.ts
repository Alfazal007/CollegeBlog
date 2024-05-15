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
            select: {
                id: true,
                views: true,
                subject: true,
                content: true,
                updatedAt: true,
                Replies: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        _count: {
                            select: {
                                UpvotesReply: true,
                                DownvotesReply: true
                            }
                        },
                        creator: {
                            select: {
                                college: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        Upvotes: true,
                        Downvotes: true
                    }
                },
                creator: {
                    select: {
                        college: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
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
