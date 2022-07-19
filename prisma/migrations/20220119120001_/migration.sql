/*
  Warnings:

  - The primary key for the `Message_Media` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attachment` on the `Message_Media` table. All the data in the column will be lost.
  - You are about to drop the column `msg_media_id` on the `Message_Media` table. All the data in the column will be lost.
  - You are about to drop the column `attachment_id` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `attatchment` to the `Message_Media` table without a default value. This is not possible if the table is not empty.
  - The required column `media_id` was added to the `Message_Media` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `sender_id` on table `Message_Media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reciever_id` on table `Message_Media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `channel_id` on table `Message_Media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message_id` on table `Message_Media` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_message_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_reciever_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_sender_id_fkey";

-- AlterTable
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_pkey",
DROP COLUMN "attachment",
DROP COLUMN "msg_media_id",
ADD COLUMN     "attatchment" TEXT NOT NULL,
ADD COLUMN     "media_id" TEXT NOT NULL,
ALTER COLUMN "sender_id" SET NOT NULL,
ALTER COLUMN "reciever_id" SET NOT NULL,
ALTER COLUMN "channel_id" SET NOT NULL,
ALTER COLUMN "message_id" SET NOT NULL,
ADD CONSTRAINT "Message_Media_pkey" PRIMARY KEY ("media_id");

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "attachment_id";

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Messages_Channel"("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE;
