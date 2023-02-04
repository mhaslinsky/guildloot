-- AlterTable
ALTER TABLE "rcLootItem" ADD COLUMN     "guildId" TEXT;

-- AddForeignKey
ALTER TABLE "rcLootItem" ADD CONSTRAINT "rcLootItem_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;
