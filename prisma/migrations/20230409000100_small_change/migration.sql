/*
  Warnings:

  - You are about to drop the column `responseId` on the `lootItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lootItem" DROP COLUMN "responseId",
ADD COLUMN     "responseID" TEXT;
