/*
  Warnings:

  - The values [APPROVED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'SOCIAL', 'SIMPLE');
ALTER TABLE "Users" ALTER COLUMN "logged_in_service" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "logged_in_service" TYPE "Status_new" USING ("logged_in_service"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Users" ALTER COLUMN "logged_in_service" SET DEFAULT 'PENDING';
COMMIT;
