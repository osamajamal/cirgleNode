/*
  Warnings:

  - Added the required column `plan_name` to the `MembershipPlans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberShipTypes" AS ENUM ('SILVER', 'GOLD', 'DIAMOND');

-- AlterTable
ALTER TABLE "MembershipPlans" DROP COLUMN "plan_name",
ADD COLUMN     "plan_name" "MemberShipTypes" NOT NULL;
