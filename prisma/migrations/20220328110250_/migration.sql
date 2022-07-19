/*
  Warnings:

  - The `plan_duration` column on the `MembershipPlans` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MembershipPlans" DROP COLUMN "plan_duration",
ADD COLUMN     "plan_duration" TIMESTAMP(3);
