/*
  Warnings:

  - You are about to drop the `DownvotesReply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpvotesReply` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `Downvotes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `Upvotes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DownvotesReply" DROP CONSTRAINT "DownvotesReply_replyId_fkey";

-- DropForeignKey
ALTER TABLE "DownvotesReply" DROP CONSTRAINT "DownvotesReply_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvotesReply" DROP CONSTRAINT "UpvotesReply_replyId_fkey";

-- DropForeignKey
ALTER TABLE "UpvotesReply" DROP CONSTRAINT "UpvotesReply_userId_fkey";

-- DropTable
DROP TABLE "DownvotesReply";

-- DropTable
DROP TABLE "UpvotesReply";

-- CreateIndex
CREATE UNIQUE INDEX "Downvotes_userId_postId_key" ON "Downvotes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvotes_userId_postId_key" ON "Upvotes"("userId", "postId");
