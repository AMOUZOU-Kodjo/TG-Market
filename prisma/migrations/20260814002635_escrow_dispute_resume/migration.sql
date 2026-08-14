-- AlterTable
ALTER TABLE "EscrowTransaction" ADD COLUMN     "disputed_by" INTEGER,
ADD COLUMN     "status_before_dispute" VARCHAR(30);
