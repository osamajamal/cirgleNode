-- AlterTable
ALTER TABLE "MembershipPlans" ADD COLUMN     "plan_duration" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "membership_valid_for" TIMESTAMP(3);
