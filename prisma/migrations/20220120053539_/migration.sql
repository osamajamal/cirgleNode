/*
  Warnings:

  - You are about to drop the `Message_Media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_message_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_reciever_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_sender_id_fkey";

-- DropTable
DROP TABLE "Message_Media";
