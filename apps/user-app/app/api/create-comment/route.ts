import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiError } from "../../../lib/ApiError";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../lib/ApiResponse";

export async function POST(request: Request) {
    const { content, postId } = await request.json();
    if (!content || !postId) {
        return Response.json(new ApiError(400, "Incomplete data provided"), {
            status: 400,
        });
    }
    const session = await getServerSession(authOptions);
    console.log({ session });
    if (!session || !session.user) {
        return Response.json(
            new ApiError(400, "No user found try logging in again"),
            { status: 400 })
    }
    try {
        const userFromDB = await prisma.user.findFirst({
            where: {
                id: session.user.id
            }
        });
        if (!userFromDB) {
            return Response.json(new ApiError(400, "No user found in the DB"), { status: 400 });
        }
        const postFromDB = await prisma.post.findFirst({
            where: {
                id: postId
            }
        });
        if (!postFromDB) {
            return Response.json(new ApiError(400, "No post with this id found in the DB"), { status: 400 });
        }
        const newReply = await prisma.replies.create({
            data: {
                postId: postId,
                content: content,
                creatorId: session?.user?.id || ""
            },
        });
        if (!newReply) {
            return Response.json(new ApiError(400, "There was an error creating the post"), {
                status: 400
            });
        }
        return Response.json(new ApiResponse(200, "A new reply was created", {}), {
            status: 200
        });
    } catch (err) {
        console.log(err);
        return Response.json(new ApiError(500, "There was an error trying to talk with the database"), {
            status: 500
        });
    }
}
