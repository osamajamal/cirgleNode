/*
  Warnings:

  - You are about to drop the column `institute` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "institute",
DROP COLUMN "profession",
ADD COLUMN     "have_kids" VARCHAR(255),
ADD COLUMN     "smoking" VARCHAR(255);
