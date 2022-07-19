-- CreateTable
CREATE TABLE "BlockProfile" (
    "id" TEXT NOT NULL,
    "blocker_id" TEXT NOT NULL,
    "blocked_id" TEXT NOT NULL,

    CONSTRAINT "BlockProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlockProfile" ADD CONSTRAINT "BlockProfile_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockProfile" ADD CONSTRAINT "BlockProfile_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
