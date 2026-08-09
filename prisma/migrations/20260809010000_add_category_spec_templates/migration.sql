-- CreateTable
CREATE TABLE "CategorySpecTemplate" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "input_type" VARCHAR(20) NOT NULL DEFAULT 'text',
    "options" TEXT[],
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategorySpecTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategorySpecTemplate_category_id_idx" ON "CategorySpecTemplate"("category_id");

-- AddForeignKey
ALTER TABLE "CategorySpecTemplate" ADD CONSTRAINT "CategorySpecTemplate_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
