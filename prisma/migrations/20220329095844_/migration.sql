/*
  Warnings:

  - The `account_types` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "account_types",
ADD COLUMN     "account_types" TEXT DEFAULT E'free';
