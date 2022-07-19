-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "social_auth_provider" DROP NOT NULL,
ALTER COLUMN "social_auth_id" DROP NOT NULL,
ALTER COLUMN "user_email" DROP NOT NULL;
