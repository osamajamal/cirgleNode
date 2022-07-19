/*
  Warnings:

  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_reciever_id_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_user_channel_id_fkey";

-- DropTable
DROP TABLE "Channel";

-- CreateTable
CREATE TABLE "Messages_Channel" (
    "channel_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "reciever_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_Channel_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "_MessagesToMessages_Channel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MessagesToMessages_Channel_AB_unique" ON "_MessagesToMessages_Channel"("A", "B");

-- CreateIndex
CREATE INDEX "_MessagesToMessages_Channel_B_index" ON "_MessagesToMessages_Channel"("B");

-- AddForeignKey
ALTER TABLE "Messages" ADD FOREIGN KEY ("user_channel_id") REFERENCES "Messages_Channel"("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages_Channel" ADD CONSTRAINT "Messages_Channel_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages_Channel" ADD CONSTRAINT "Messages_Channel_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagesToMessages_Channel" ADD FOREIGN KEY ("A") REFERENCES "Messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagesToMessages_Channel" ADD FOREIGN KEY ("B") REFERENCES "Messages_Channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;
