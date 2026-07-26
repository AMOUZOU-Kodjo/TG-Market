-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
