/*
  Warnings:

  - A unique constraint covering the columns `[trackerId,player]` on the table `lootItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lootItem_trackerId_player_key" ON "lootItem"("trackerId", "player");
