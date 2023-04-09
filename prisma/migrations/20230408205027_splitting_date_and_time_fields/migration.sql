/*
  Warnings:

  - You are about to drop the column `dateTime` on the `lootItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lootItem" DROP COLUMN "dateTime",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "time" TIMESTAMP(3);
