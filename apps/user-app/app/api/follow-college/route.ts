import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiError } from "../../../lib/ApiError";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../lib/ApiResponse";

export async function POST(request: Request) {
    const { collegeName } = await request.json()
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json(
            new ApiError(400, "No user found try logging in again"),
            {
                status: 400,
            }
        );
    }
    if (!collegeName || collegeName.length <= 0) {
        return Response.json(new ApiError(400, "Provide some valid data"), { status: 400 })
    }
    try {
        // check if user is already following or not
        const isUserFollowing = await prisma.user.findFirst({
            where: {
                id: session.user.id,
                interestedColleges: {
                    some: {
                        name: collegeName
                    }
                }
            }
        });
        if (isUserFollowing) {
            console.log(`Is user following ${isUserFollowing}`)
            return Response.json(new ApiResponse(200, "Already following the contents of this college", { isFollowing: true }), { status: 200 })
        }
        const res = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                interestedColleges: {
                    connect: {
                        name: collegeName
                    }
                }
            }
        })
        console.log(`After update ${res}`)
        return Response.json(new ApiResponse(200, "Done", { isUserFollowing }), { status: 200 })
        // if already following then return
        // if not following then follow the user
        // return positive response
    } catch (err) {
        return Response.json(new ApiError(500, "There was an error at the server end"), { status: 500 })
    }
}
