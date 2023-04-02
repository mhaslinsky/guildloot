-- CreateTable
CREATE TABLE "lootItem" (
    "id" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3),
    "itemId" INTEGER NOT NULL,
    "itemString" TEXT,
    "response" TEXT,
    "offspec" INTEGER,
    "votes" INTEGER,
    "class" TEXT,
    "instance" TEXT,
    "boss" TEXT,
    "gear1" TEXT,
    "gear2" TEXT,
    "responseId" TEXT,
    "isAwardReason" BOOLEAN,
    "rollType" TEXT,
    "equipLoc" TEXT,
    "note" TEXT,
    "owner" TEXT,
    "itemName" TEXT,
    "guildId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lootItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lootItem" ADD CONSTRAINT "lootItem_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lootItem" ADD CONSTRAINT "lootItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "blizzAPIItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
