/*
  Warnings:

  - A unique constraint covering the columns `[friendCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friendCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "seen" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_friendCode_key" ON "User"("friendCode");
