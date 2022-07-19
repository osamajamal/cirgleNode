/*
  Warnings:

  - You are about to drop the column `childern` on the `Filters` table. All the data in the column will be lost.
  - You are about to drop the column `end_height` on the `Filters` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Filters` table. All the data in the column will be lost.
  - You are about to drop the column `last_age` on the `Filters` table. All the data in the column will be lost.
  - You are about to drop the column `other_filter` on the `Filters` table. All the data in the column will be lost.
  - You are about to drop the column `start_age` on the `Filters` table. All the data in the column will be lost.
  - You are about to drop the column `start_height` on the `Filters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Filters" DROP COLUMN "childern",
DROP COLUMN "end_height",
DROP COLUMN "gender",
DROP COLUMN "last_age",
DROP COLUMN "other_filter",
DROP COLUMN "start_age",
DROP COLUMN "start_height",
ADD COLUMN     "filters" TEXT;
