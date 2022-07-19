/*
  Warnings:

  - You are about to drop the `_MessagesToMessages_Channel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MessagesToMessages_Channel" DROP CONSTRAINT "_MessagesToMessages_Channel_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessagesToMessages_Channel" DROP CONSTRAINT "_MessagesToMessages_Channel_B_fkey";

-- DropTable
DROP TABLE "_MessagesToMessages_Channel";
