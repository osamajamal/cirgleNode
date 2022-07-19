/*
  Warnings:

  - You are about to drop the column `is_phone_verified` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `otpcode` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User_passions" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "is_phone_verified",
DROP COLUMN "otpcode",
DROP COLUMN "phone_number",
ADD COLUMN     "user_password" VARCHAR(255);

-- CreateTable
CREATE TABLE "Otp" (
    "otp_id" TEXT NOT NULL,
    "user_email" VARCHAR(255),
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "otpcode" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("otp_id")
);
