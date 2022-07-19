/*
  Warnings:

  - Made the column `social_auth_provider` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `social_auth_id` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "social_auth_provider" SET NOT NULL,
ALTER COLUMN "social_auth_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "User_gallery" (
    "gallery_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "picture_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_gallery_pkey" PRIMARY KEY ("gallery_id")
);

-- AddForeignKey
ALTER TABLE "User_gallery" ADD CONSTRAINT "User_gallery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
