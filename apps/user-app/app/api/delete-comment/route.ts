import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiError } from "../../../lib/ApiError";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../lib/ApiResponse";

export async function DELETE(request: Request) {
    const { replyId } = await request.json();
    if (!replyId) {
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
        const replyFromDB = await prisma.replies.findFirst({
            where: {
                id: replyId
            }
        });
        if (!replyFromDB) {
            return Response.json(new ApiError(400, "No reply with this id found in the DB"), { status: 400 });
        }
        if (replyFromDB.creatorId !== session.user.id) {
            return Response.json(new ApiError(400, "Only the creator of this comment can delete this comment"), { status: 400 });
        }
        await prisma.replies.delete({
            where: {
                id: replyId
            }
        })
        return Response.json(new ApiResponse(200, "Comment deleted successfully", {}), {
            status: 200
        });
    } catch (err) {
        console.log(err);
        return Response.json(new ApiError(500, "There was an error while talking to the database"), {
            status: 500
        });
    }
}
