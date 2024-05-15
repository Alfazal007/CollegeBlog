import prisma from "@repo/db/client";
import { ApiError } from "../../../../lib/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "../../../../lib/ApiResponse";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
    const postId = params.postId;
    console.log("HERE");
    console.log({ params });
    if (!postId) {
        return Response.json(new ApiError(400, "No postid in request body"), { status: 400 });
    }
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json(new ApiError(400, "Login dude"), { status: 400 })
    }
    try {
        const userLikedPost = await prisma.upvotes.findFirst({
            where: {
                postId: postId,
                userId: session.user.id || ""
            }
        });
        if (userLikedPost) {
            return Response.json(new ApiResponse(200, "Found", { liked: true }), { status: 200 });
        } else {
            return Response.json(new ApiResponse(200, "Not  found", { liked: false }), { status: 200 });
        }
    } catch (err) {
        console.log(err);
        return Response.json(new ApiError(500, "There was an error fetching the data from db"), { status: 500 });
    }
}
