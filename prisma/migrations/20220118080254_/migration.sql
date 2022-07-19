/*
  Warnings:

  - You are about to drop the column `company` on the `Users` table. All the data in the column will be lost.
  - Made the column `created_at` on table `BlockProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `BlockProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Filters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Filters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `User_Likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `User_Likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `User_gallery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `User_gallery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `User_passions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `User_passions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'MEDIA');

-- AlterTable
ALTER TABLE "BlockProfile" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Filters" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "User_Likes" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "User_gallery" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "User_passions" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "company",
ADD COLUMN     "interested_in" VARCHAR(255),
ADD COLUMN     "online_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "online_status_time" TIMESTAMP(3),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateTable
CREATE TABLE "Messages" (
    "message_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "reciever_id" TEXT NOT NULL,
    "user_channel_id" TEXT NOT NULL,
    "message" TEXT,
    "media" TEXT,
    "message_type" "MessageType" NOT NULL DEFAULT E'TEXT',
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channel_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "reciever_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channel_id")
);

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_user_channel_id_fkey" FOREIGN KEY ("user_channel_id") REFERENCES "Channel"("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
