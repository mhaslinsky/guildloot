/*
  Warnings:

  - A unique constraint covering the columns `[trackerId,player,guildId]` on the table `lootItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "lootItem_trackerId_player_key";

-- CreateIndex
CREATE UNIQUE INDEX "lootItem_trackerId_player_guildId_key" ON "lootItem"("trackerId", "player", "guildId");
