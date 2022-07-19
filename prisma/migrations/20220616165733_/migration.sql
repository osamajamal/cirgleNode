/*
  Warnings:

  - You are about to drop the column `account_types` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `accounts_created_on_ref` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `admin_approval` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `fcm_token` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `filters_access` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `have_kids` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `interested_in` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `is_registered` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `logged_in_service` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `looking_for_something` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `membership_created_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `membership_valid_for` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `online_status` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `online_status_time` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `other_info` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `referal_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `see_who_super_likes_me` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `show_private_pictures` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `smoking` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `social_auth_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `social_auth_provider` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `super_likes` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlockProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Filters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MembershipPlans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages_Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Super_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_gallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_passions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlockProfile" DROP CONSTRAINT "BlockProfile_blocked_id_fkey";

-- DropForeignKey
ALTER TABLE "BlockProfile" DROP CONSTRAINT "BlockProfile_blocker_id_fkey";

-- DropForeignKey
ALTER TABLE "Filters" DROP CONSTRAINT "Filters_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_msg_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_reciever_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages_Channel" DROP CONSTRAINT "Messages_Channel_reciever_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages_Channel" DROP CONSTRAINT "Messages_Channel_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_from_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_to_id_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_reported_id_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_reporter_id_fkey";

-- DropForeignKey
ALTER TABLE "Super_likes" DROP CONSTRAINT "Super_likes_from_id_fkey";

-- DropForeignKey
ALTER TABLE "Super_likes" DROP CONSTRAINT "Super_likes_to_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Likes" DROP CONSTRAINT "User_Likes_from_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Likes" DROP CONSTRAINT "User_Likes_to_id_fkey";

-- DropForeignKey
ALTER TABLE "User_gallery" DROP CONSTRAINT "User_gallery_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_passions" DROP CONSTRAINT "User_passions_user_id_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "account_types",
DROP COLUMN "accounts_created_on_ref",
DROP COLUMN "admin_approval",
DROP COLUMN "bio",
DROP COLUMN "birthday",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "education",
DROP COLUMN "fcm_token",
DROP COLUMN "filters_access",
DROP COLUMN "have_kids",
DROP COLUMN "height",
DROP COLUMN "interested_in",
DROP COLUMN "is_registered",
DROP COLUMN "latitude",
DROP COLUMN "logged_in_service",
DROP COLUMN "longitude",
DROP COLUMN "looking_for_something",
DROP COLUMN "membership_created_at",
DROP COLUMN "membership_valid_for",
DROP COLUMN "nationality",
DROP COLUMN "notifications",
DROP COLUMN "online_status",
DROP COLUMN "online_status_time",
DROP COLUMN "other_info",
DROP COLUMN "profile_picture",
DROP COLUMN "referal_id",
DROP COLUMN "religion",
DROP COLUMN "see_who_super_likes_me",
DROP COLUMN "show_private_pictures",
DROP COLUMN "smoking",
DROP COLUMN "social_auth_id",
DROP COLUMN "social_auth_provider",
DROP COLUMN "super_likes",
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "phoneNo" INTEGER;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "BlockProfile";

-- DropTable
DROP TABLE "Filters";

-- DropTable
DROP TABLE "MembershipPlans";

-- DropTable
DROP TABLE "Messages";

-- DropTable
DROP TABLE "Messages_Channel";

-- DropTable
DROP TABLE "Notifications";

-- DropTable
DROP TABLE "Reports";

-- DropTable
DROP TABLE "Super_likes";

-- DropTable
DROP TABLE "User_Likes";

-- DropTable
DROP TABLE "User_gallery";

-- DropTable
DROP TABLE "User_passions";

-- DropEnum
DROP TYPE "AccountTypes";

-- DropEnum
DROP TYPE "AdminApproval";

-- DropEnum
DROP TYPE "LikeTypes";

-- DropEnum
DROP TYPE "MemberShipTypes";

-- DropEnum
DROP TYPE "MessageType";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "Role";
