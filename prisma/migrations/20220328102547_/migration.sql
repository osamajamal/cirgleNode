/*
  Warnings:

  - The `plan_name` column on the `MembershipPlans` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MembershipPlans" DROP COLUMN "plan_name",
ADD COLUMN     "plan_name" TEXT;

-- DropEnum
DROP TYPE "MemberShipTypes";
