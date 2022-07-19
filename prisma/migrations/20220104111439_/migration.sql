-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "otpcode" INTEGER NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "user_phone" VARCHAR(255) NOT NULL,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);
