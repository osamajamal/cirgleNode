-- AlterTable
ALTER TABLE "User_gallery" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "bio" VARCHAR(255),
ADD COLUMN     "city" VARCHAR(255),
ADD COLUMN     "company" VARCHAR(255),
ADD COLUMN     "country" VARCHAR(255),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "profession" VARCHAR(255);

-- CreateTable
CREATE TABLE "Passions" (
    "passions_id" TEXT NOT NULL,

    CONSTRAINT "Passions_pkey" PRIMARY KEY ("passions_id")
);

-- CreateTable
CREATE TABLE "User_preferences" (
    "preferences_id" TEXT NOT NULL,

    CONSTRAINT "User_preferences_pkey" PRIMARY KEY ("preferences_id")
);
