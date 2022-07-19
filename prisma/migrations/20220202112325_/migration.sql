-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "filters_access" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "see_who_super_likes_me" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "super_likes" BOOLEAN NOT NULL DEFAULT false;
