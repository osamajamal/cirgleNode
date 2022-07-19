/*
  Warnings:

  - You are about to drop the column `is_phone_login` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `is_social_login` on the `Users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'PENDING');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "is_phone_login",
DROP COLUMN "is_social_login",
ADD COLUMN     "logged_in_service" "Status" NOT NULL DEFAULT E'PENDING';
