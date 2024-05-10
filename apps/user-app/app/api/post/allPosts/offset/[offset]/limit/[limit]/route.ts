import prisma from "@repo/db/client";
import { ApiError } from "../../../../../../../../lib/ApiError";
import { ApiResponse } from "../../../../../../../../lib/ApiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth/[...nextauth]/options";
import redis from "../../../../../../../../lib/Redis";

export async function GET(request: Request, { params }: { params: { offset: number, limit: number } }) {
  const { limit, offset } = params;
  let limitNum = Number(limit);
  let offsetNum = Number(offset);
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      new ApiError(400, "No user found try logging in again"),
      {
        status: 400,
      }
    );
  }
  if (!offsetNum) {
    offsetNum = 0;
  }
  if (!limitNum) {
    limitNum = 10;
  }
  try {
    const postsToSend = await redis.hget('posts', 'allPosts');
    if (!postsToSend) {
      const allPosts = await prisma.post.findMany({
        take: limitNum,
        skip: offset * limitNum,
        orderBy: {
          createdAt: "desc"
        }
      });
      await redis.hset('posts', 'allPosts', JSON.stringify(allPosts));
      await redis.expire('posts', 3600);
      return Response.json(new ApiResponse(200, `Found totally ${allPosts.length} posts DB DATA`, allPosts));
    } else {
      const data = JSON.parse(postsToSend.replace(/\\/g, ''));
      return Response.json(new ApiResponse(200, `Found totally ${data.length} posts REDIS DATA`, data));
    }
  } catch (error) {
    console.log(error);
    return Response.json(new ApiError(500, "Could not get post"), {
      status: 500,
    });
  }
}

