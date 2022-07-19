/*
  Warnings:

  - You are about to drop the column `channel_id` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `msg_channel_id` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_channel_id_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "channel_id",
ADD COLUMN     "msg_channel_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD FOREIGN KEY ("msg_channel_id") REFERENCES "Messages_Channel"("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE;
