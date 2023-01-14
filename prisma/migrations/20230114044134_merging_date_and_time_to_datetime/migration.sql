/*
  Warnings:

  - You are about to drop the column `date` on the `rcLootItem` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `rcLootItem` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `rcLootItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rcLootItem" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
