-- AddForeignKey
ALTER TABLE "User_Likes" ADD CONSTRAINT "User_Likes_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
