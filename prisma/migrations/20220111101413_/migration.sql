/*
  Warnings:

  - The `gender` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT E'MALE';

-- DropEnum
DROP TYPE "Status";
