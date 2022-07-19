-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_message_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_reciever_id_fkey";

-- DropForeignKey
ALTER TABLE "Message_Media" DROP CONSTRAINT "Message_Media_sender_id_fkey";

-- AlterTable
ALTER TABLE "Message_Media" ALTER COLUMN "sender_id" DROP NOT NULL,
ALTER COLUMN "reciever_id" DROP NOT NULL,
ALTER COLUMN "channel_id" DROP NOT NULL,
ALTER COLUMN "message_id" DROP NOT NULL,
ALTER COLUMN "attatchment" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_Media" ADD CONSTRAINT "Message_Media_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Messages_Channel"("channel_id") ON DELETE SET NULL ON UPDATE CASCADE;
