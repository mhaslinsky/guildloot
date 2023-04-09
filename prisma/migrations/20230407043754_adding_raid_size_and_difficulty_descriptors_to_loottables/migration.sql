-- CreateEnum
CREATE TYPE "raidSize" AS ENUM ('TWENTY_FIVE', 'TEN');

-- CreateEnum
CREATE TYPE "raidDiffculty" AS ENUM ('NORMAL', 'HEROIC');

-- AlterTable
ALTER TABLE "lootItem" ADD COLUMN     "raidDiffculty" "raidDiffculty",
ADD COLUMN     "raidSize" "raidSize";
