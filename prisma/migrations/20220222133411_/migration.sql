/*
  Warnings:

  - You are about to drop the column `status` on the `Users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AdminApproval" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "status",
ADD COLUMN     "admin_approval" "AdminApproval" NOT NULL DEFAULT E'PENDING';
