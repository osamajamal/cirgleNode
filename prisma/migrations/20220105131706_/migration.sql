-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "is_phone_login" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_social_login" BOOLEAN NOT NULL DEFAULT false;
