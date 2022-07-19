/*
  Warnings:

  - You are about to drop the column `online_status_time` on the `Users` table. All the data in the column will be lost.
  - Made the column `created_at` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "online_status_time",
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
