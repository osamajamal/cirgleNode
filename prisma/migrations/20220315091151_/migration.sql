-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'SUPER_LIKE');

-- CreateTable
CREATE TABLE "Notifications" (
    "notifications_id" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notifications_id")
);

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
