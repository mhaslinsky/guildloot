/*
  Warnings:

  - You are about to drop the column `guildId` on the `rcLootItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rcLootItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rcLootItem" DROP CONSTRAINT "rcLootItem_guildId_fkey";

-- AlterTable
ALTER TABLE "rcLootItem" DROP COLUMN "guildId",
DROP COLUMN "updatedAt";
