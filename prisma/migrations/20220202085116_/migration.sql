/*
  Warnings:

  - The values [PLATINUM] on the enum `AccountTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountTypes_new" AS ENUM ('FREE', 'SILVER', 'GOLD', 'DIAMOND');
ALTER TABLE "Users" ALTER COLUMN "account_types" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "account_types" TYPE "AccountTypes_new" USING ("account_types"::text::"AccountTypes_new");
ALTER TYPE "AccountTypes" RENAME TO "AccountTypes_old";
ALTER TYPE "AccountTypes_new" RENAME TO "AccountTypes";
DROP TYPE "AccountTypes_old";
ALTER TABLE "Users" ALTER COLUMN "account_types" SET DEFAULT 'FREE';
COMMIT;
