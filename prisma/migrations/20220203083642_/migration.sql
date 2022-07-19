/*
  Warnings:

  - Made the column `plan_name` on table `MembershipPlans` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `plan_price` to the `MembershipPlans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MembershipPlans" ALTER COLUMN "plan_name" SET NOT NULL,
DROP COLUMN "plan_price",
ADD COLUMN     "plan_price" DOUBLE PRECISION NOT NULL;
