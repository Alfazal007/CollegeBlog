-- DropForeignKey
ALTER TABLE "Downvotes" DROP CONSTRAINT "Downvotes_postId_fkey";

-- DropForeignKey
ALTER TABLE "Downvotes" DROP CONSTRAINT "Downvotes_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvotesReply" DROP CONSTRAINT "DownvotesReply_replyId_fkey";

-- DropForeignKey
ALTER TABLE "DownvotesReply" DROP CONSTRAINT "DownvotesReply_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "Replies_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "Replies_postId_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_postId_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvotesReply" DROP CONSTRAINT "UpvotesReply_replyId_fkey";

-- DropForeignKey
ALTER TABLE "UpvotesReply" DROP CONSTRAINT "UpvotesReply_userId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "subject" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downvotes" ADD CONSTRAINT "Downvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downvotes" ADD CONSTRAINT "Downvotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvotesReply" ADD CONSTRAINT "UpvotesReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvotesReply" ADD CONSTRAINT "UpvotesReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvotesReply" ADD CONSTRAINT "DownvotesReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvotesReply" ADD CONSTRAINT "DownvotesReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
