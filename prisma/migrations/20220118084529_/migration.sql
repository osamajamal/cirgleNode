/*
  Warnings:

  - Made the column `updated_at` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `online_status_time` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "online_status_time" SET NOT NULL;
