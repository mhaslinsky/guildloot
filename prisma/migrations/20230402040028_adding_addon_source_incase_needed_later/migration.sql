/*
  Warnings:

  - Added the required column `source` to the `lootItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackerId` to the `lootItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TrackerSource" AS ENUM ('RC', 'GARGUL');

-- AlterTable
ALTER TABLE "lootItem" ADD COLUMN     "source" "TrackerSource" NOT NULL,
ADD COLUMN     "trackerId" TEXT NOT NULL;
