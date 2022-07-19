-- CreateTable
CREATE TABLE "MembershipPlans" (
    "plan_id" TEXT NOT NULL,
    "plan_name" VARCHAR(255),
    "plan_price" VARCHAR(255),

    CONSTRAINT "MembershipPlans_pkey" PRIMARY KEY ("plan_id")
);
