-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Note_userId_isFavorite_updatedAt_idx" ON "public"."Note"("userId", "isFavorite", "updatedAt");
