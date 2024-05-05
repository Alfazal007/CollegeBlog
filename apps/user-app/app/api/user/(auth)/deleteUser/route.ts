import { getServerSession } from "next-auth";
import { ApiError } from "../../../../../lib/ApiError";
import { authOptions } from "../../../auth/[...nextauth]/options";
import prisma from "@repo/db/client";
import { ApiResponse } from "../../../../../lib/ApiResponse";

export async function DELETE(_: Request) {
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
          id: session.user.id
        }
      }
    );
    if (!userFromDb) {
      return Response.json(new ApiError(404, "No User found to be deleted"));
    }
    await prisma.user.delete({
      where: {
        id: userFromDb.id
      }
    });
    return Response.json(new ApiResponse(200, "Deleted the user successfully from the DB", {}));
  } catch (error) {
    return Response.json(new ApiError(500, "There was an error trying to find the user in the DB"));
  }
}

