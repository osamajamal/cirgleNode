-- CreateTable
CREATE TABLE "Super_likes" (
    "Super_likes_id" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Super_likes_pkey" PRIMARY KEY ("Super_likes_id")
);

-- AddForeignKey
ALTER TABLE "Super_likes" ADD CONSTRAINT "Super_likes_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Super_likes" ADD CONSTRAINT "Super_likes_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
