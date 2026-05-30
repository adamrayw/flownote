-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Note_userId_isArchived_updatedAt_idx" ON "public"."Note"("userId", "isArchived", "updatedAt");
