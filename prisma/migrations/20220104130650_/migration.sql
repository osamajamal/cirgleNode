/*
  Warnings:

  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Otp";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "birthday" VARCHAR(255),
    "gender" VARCHAR(255),
    "institute" VARCHAR(255),
    "social_auth_provider" VARCHAR(255),
    "social_auth_id" VARCHAR(255),
    "otpcode" INTEGER NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);
