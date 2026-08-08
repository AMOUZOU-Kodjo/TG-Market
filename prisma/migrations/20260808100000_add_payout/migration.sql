-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('pending', 'sent', 'paid', 'failed');

-- CreateTable
CREATE TABLE "Payout" (
    "id" SERIAL NOT NULL,
    "escrow_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL DEFAULT 0,
    "provider" "PaymentProvider",
    "account" VARCHAR(100),
    "status" "PayoutStatus" NOT NULL DEFAULT 'pending',
    "reference" VARCHAR(100),
    "error_message" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payout_seller_id_idx" ON "Payout"("seller_id");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- CreateIndex
CREATE INDEX "Payout_created_at_idx" ON "Payout"("created_at");

-- CreateIndex
CREATE INDEX "Payout_escrow_id_idx" ON "Payout"("escrow_id");

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_escrow_id_fkey" FOREIGN KEY ("escrow_id") REFERENCES "EscrowTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;