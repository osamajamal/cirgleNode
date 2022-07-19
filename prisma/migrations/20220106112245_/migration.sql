/*
  Warnings:

  - The `logged_in_service` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Passions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "education" VARCHAR(255),
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "religion" VARCHAR(255),
ADD COLUMN     "status" VARCHAR(255),
DROP COLUMN "logged_in_service",
ADD COLUMN     "logged_in_service" VARCHAR(255);

-- DropTable
DROP TABLE "Passions";

-- DropTable
DROP TABLE "User_preferences";

-- CreateTable
CREATE TABLE "User_passions" (
    "passions_id" TEXT NOT NULL,
    "user_id" TEXT,
    "passions" TEXT,

    CONSTRAINT "User_passions_pkey" PRIMARY KEY ("passions_id")
);

-- AddForeignKey
ALTER TABLE "User_passions" ADD CONSTRAINT "User_passions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
