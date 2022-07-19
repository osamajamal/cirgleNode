-- AlterTable
ALTER TABLE "Super_likes" ADD COLUMN     "like_type" "LikeTypes" NOT NULL DEFAULT E'SUPER_LIKE';

-- AlterTable
ALTER TABLE "User_Likes" ADD COLUMN     "like_type" "LikeTypes" NOT NULL DEFAULT E'SIMPLE_LIKE';
