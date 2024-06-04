import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiError } from "../../../lib/ApiError";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../lib/ApiResponse";

interface CollegeToReturn {
    name: string,
    id: string,
    isFollowing: boolean
}

export async function GET(_: Request) {
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
        const allColleges = await prisma.college.findMany({
            select: {
                name: true,
                id: true
            }
        });
        const userInterestedColleges = await prisma.user.findFirst({
            where: {
                id: session.user.id
            },
            select: {
                interestedColleges: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });
        const userInterestedCollegeName: string[] = []
        userInterestedColleges?.interestedColleges.map((college: any) => {
            userInterestedCollegeName.push(college.name)
        })
        const collegeToReturn: CollegeToReturn[] = []
        allColleges.map((college) => {
            if (userInterestedCollegeName.includes(college.name)) {
                collegeToReturn.push({ ...college, isFollowing: true })
            } else {
                collegeToReturn.push({ ...college, isFollowing: false })
            }
        })
        return Response.json(new ApiResponse(200, "Here is a list of colleges", collegeToReturn), { status: 200 })
    } catch (err) {
        return Response.json(new ApiError(400, "There was an error talking to the database"), { status: 400 })
    }
}

