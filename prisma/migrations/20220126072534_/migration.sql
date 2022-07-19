-- CreateEnum
CREATE TYPE "AccountTypes" AS ENUM ('FREE', 'SILVER', 'GOLD', 'DIAMOND', 'PLATINUM');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "account_types" "AccountTypes" NOT NULL DEFAULT E'FREE',
ADD COLUMN     "accounts_created_on_ref" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referal_id" VARCHAR(255);

-- DropEnum
DROP TYPE "AccountType";
