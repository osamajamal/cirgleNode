/*
  Warnings:

  - You are about to drop the column `media` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "media",
DROP COLUMN "message",
ADD COLUMN     "attachment" TEXT,
ADD COLUMN     "message_body" TEXT;
