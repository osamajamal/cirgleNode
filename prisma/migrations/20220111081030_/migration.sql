-- CreateTable
CREATE TABLE "User_Likes" (
    "User_Likes_id" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_Likes_pkey" PRIMARY KEY ("User_Likes_id")
);

-- AddForeignKey
ALTER TABLE "User_Likes" ADD CONSTRAINT "User_Likes_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
