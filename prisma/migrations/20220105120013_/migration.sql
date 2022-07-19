-- DropForeignKey
ALTER TABLE "User_gallery" DROP CONSTRAINT "User_gallery_user_id_fkey";

-- AlterTable
ALTER TABLE "User_gallery" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User_gallery" ADD CONSTRAINT "User_gallery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
