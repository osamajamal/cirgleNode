/*
  Warnings:

  - You are about to alter the column `latitude` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `VarChar(255)`.
  - You are about to alter the column `longitude` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `VarChar(255)`.
  - You are about to alter the column `height` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "latitude" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "longitude" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "height" SET DATA TYPE VARCHAR(255);
