import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../../../lib/ApiResponse";
import { ApiError } from "../../../../../../lib/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/options";

export async function GET(_: Request, { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  if (!userid) {
    return Response.json(new ApiError(400, "Give a valid user id in the parameters"));
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
    const userFromDb = await prisma.user.findFirst(
      {
        where: {
          id: userid
        },
        select: {
          id: true,
          username: true,
          email: true,
          college: true,
        }
      }
    );
    if (!userFromDb) {
      return Response.json(new ApiError(404, "No User found"));
    }
    return Response.json(new ApiResponse(200, "Found the user", userFromDb));
  } catch (error) {
    return Response.json(new ApiError(500, "There was an error trying to find the user in the DB"));
  }
}

