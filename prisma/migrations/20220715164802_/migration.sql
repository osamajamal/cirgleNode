-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "image" TEXT NOT NULL DEFAULT E'https://source.unsplash.com/user/c_v_r/1600x900',
ADD COLUMN     "social_auth_id" VARCHAR(255),
ADD COLUMN     "social_auth_provider" VARCHAR(255);
