/*
  Warnings:

  - You are about to drop the column `attachment` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `user_channel_id` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `channel_id` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_user_channel_id_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "attachment",
DROP COLUMN "user_channel_id",
ADD COLUMN     "attachment_id" TEXT,
ADD COLUMN     "channel_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Message_Media" (
    "msg_media_id" TEXT NOT NULL,
    "sender_id" TEXT,
    "reciever_id" TEXT,
    "channel_id" TEXT,
    "message_id" TEXT,
    "attachment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_Media_pkey" PRIMARY KEY ("msg_media_id")
);

-- AddForeignKey
ALTER TABLE "Messages" ADD FOREIGN KEY ("channel_id") REFERENCES "Messages_Channel"("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Messages_Channel"("channel_id") ON DELETE SET NULL ON UPDATE CASCADE;
