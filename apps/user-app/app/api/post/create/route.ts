import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { ApiError } from "../../../../lib/ApiError";
import { ApiResponse } from "../../../../lib/ApiResponse";
import { authOptions } from "../../auth/[...nextauth]/options";
import redis from "../../../../lib/Redis";

export async function POST(request: Request) {
    const { subject, content } = await request.json();
    console.log({ subject });
    console.log({ content });
    if (!subject || !content) {
        return Response.json(new ApiError(400, "Incomplete data provided"), {
            status: 400,
        });
    }
    const session = await getServerSession(authOptions);
    console.log({ session });
    if (!session || !session.user) {
        return Response.json(
            new ApiError(400, "No user found try logging in again"),
            {
                status: 400,
            }
        );
    }

    try {
        const userFromDB = await prisma.user.findFirst({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                isVerified: true,
                email: true,
                college: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!userFromDB || !userFromDB.isVerified) {
            return Response.json(
                new ApiError(
                    400,
                    "Try logging in or verifying your account and logging in again"
                ),
                {
                    status: 400,
                }
            );
        }

        const postInserted = await prisma.post.create({
            data: {
                content,
                subject,
                creatorId: userFromDB.id,
            },
        });
        if (!postInserted) {
            return Response.json(new ApiError(400, "Could not add post"), {
                status: 400,
            });
        } else {
            const peopleFollowingCollege = await prisma.user.findMany({
                where: {
                    interestedColleges: {
                        some: {
                            name: userFromDB.college.name
                        }
                    }
                },
                select: {
                    email: true
                }
            });
            const allFollowers: string[] = [];
            peopleFollowingCollege.map((singlePerson) => {
                allFollowers.push(singlePerson.email)
            })
            await redis.hdel("posts", "allPosts");
            if (peopleFollowingCollege && peopleFollowingCollege.length > 0) {
                await redis.lpush("notify", JSON.stringify({ college: userFromDB.college.name, url: `http://localhost:3000/post/getpost/${postInserted.id}`, email: allFollowers }))
            }
            return Response.json(
                new ApiResponse(201, "Added post successfully", {
                    postId: postInserted.id,
                }),
                {
                    status: 201,
                }
            );
        }
    } catch (error) {
        console.log(error);
        return Response.json(new ApiError(500, "Could not add post"), {
            status: 500,
        });
    }
}
