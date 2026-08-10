-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'countered');

-- CreateEnum
CREATE TYPE "BundleProposalStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- AlterEnum
ALTER TYPE "EscrowStatus" ADD VALUE 'awaiting_verification';

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'commission';

-- AlterTable
ALTER TABLE "EscrowTransaction" ADD COLUMN     "bundle_id" INTEGER,
ADD COLUMN     "confirmation_code" VARCHAR(6),
ADD COLUMN     "payment_ref" VARCHAR(100);

-- AlterTable
ALTER TABLE "Payout" ALTER COLUMN "fee" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SiteSetting" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "google_id" VARCHAR(255),
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_secret" VARCHAR(500),
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'pending',
    "message" VARCHAR(500),
    "countered_amount" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "total_price" INTEGER NOT NULL,
    "bundle_price" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleItem" (
    "id" SERIAL NOT NULL,
    "bundle_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "BundleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleProposal" (
    "id" SERIAL NOT NULL,
    "bundle_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "proposed_price" INTEGER NOT NULL,
    "message" VARCHAR(500),
    "status" "BundleProposalStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundleProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Offer_product_id_idx" ON "Offer"("product_id");

-- CreateIndex
CREATE INDEX "Offer_buyer_id_idx" ON "Offer"("buyer_id");

-- CreateIndex
CREATE INDEX "Offer_seller_id_idx" ON "Offer"("seller_id");

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");

-- CreateIndex
CREATE INDEX "Bundle_seller_id_idx" ON "Bundle"("seller_id");

-- CreateIndex
CREATE INDEX "Bundle_status_idx" ON "Bundle"("status");

-- CreateIndex
CREATE INDEX "BundleItem_bundle_id_idx" ON "BundleItem"("bundle_id");

-- CreateIndex
CREATE INDEX "BundleItem_product_id_idx" ON "BundleItem"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "BundleItem_bundle_id_product_id_key" ON "BundleItem"("bundle_id", "product_id");

-- CreateIndex
CREATE INDEX "BundleProposal_bundle_id_idx" ON "BundleProposal"("bundle_id");

-- CreateIndex
CREATE INDEX "BundleProposal_buyer_id_idx" ON "BundleProposal"("buyer_id");

-- CreateIndex
CREATE INDEX "BundleProposal_seller_id_idx" ON "BundleProposal"("seller_id");

-- CreateIndex
CREATE INDEX "BundleProposal_status_idx" ON "BundleProposal"("status");

-- CreateIndex
CREATE INDEX "EscrowTransaction_bundle_id_idx" ON "EscrowTransaction"("bundle_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");

-- AddForeignKey
ALTER TABLE "EscrowTransaction" ADD CONSTRAINT "EscrowTransaction_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleProposal" ADD CONSTRAINT "BundleProposal_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleProposal" ADD CONSTRAINT "BundleProposal_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleProposal" ADD CONSTRAINT "BundleProposal_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
