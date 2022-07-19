-- AlterTable
ALTER TABLE "BlockProfile" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Filters" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "gender" TEXT,
    "start_age" TEXT,
    "last_age" TEXT,
    "start_height" TEXT,
    "end_height" TEXT,
    "childern" TEXT,
    "other_filter" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Filters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Filters" ADD CONSTRAINT "Filters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
