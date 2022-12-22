-- CreateTable
CREATE TABLE "rcLootItem" (
    "id" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemString" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "votes" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "instance" TEXT NOT NULL,
    "boss" TEXT NOT NULL,
    "gear1" TEXT NOT NULL,
    "gear2" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "isAwardReason" BOOLEAN NOT NULL,
    "rollType" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "equipLoc" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rcLootItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blizzAPIItem" (
    "id" SERIAL NOT NULL,
    "href" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qualityType" TEXT NOT NULL,
    "qualityName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "requiredLevel" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaHref" TEXT NOT NULL,
    "itemClassId" INTEGER NOT NULL,
    "itemClassName" TEXT NOT NULL,
    "itemClassHref" TEXT NOT NULL,
    "itemSubclassId" INTEGER NOT NULL,
    "itemSubclassName" TEXT NOT NULL,
    "itemSubclassHref" TEXT NOT NULL,
    "inventoryType" TEXT NOT NULL,
    "inventoryName" TEXT NOT NULL,
    "purchasePrice" INTEGER NOT NULL,
    "sellPrice" INTEGER NOT NULL,
    "maxCount" INTEGER NOT NULL,
    "isEquippable" BOOLEAN NOT NULL,
    "isStackable" BOOLEAN NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "previewItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blizzAPIItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviewItem" (
    "id" SERIAL NOT NULL,
    "itemHref" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "qualityType" TEXT NOT NULL,
    "qualityName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mediaHref" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "itemClassHref" TEXT NOT NULL,
    "itemClassName" TEXT NOT NULL,
    "itemClassId" INTEGER NOT NULL,
    "itemSubclassHref" TEXT NOT NULL,
    "itemSubclassName" TEXT NOT NULL,
    "itemSubclassId" INTEGER NOT NULL,
    "inventoryType" TEXT NOT NULL,
    "inventoryName" TEXT NOT NULL,
    "bindingType" TEXT NOT NULL,
    "bindingName" TEXT NOT NULL,
    "uniqueEquipped" TEXT NOT NULL,
    "weaponMinDamage" INTEGER NOT NULL,
    "weaponMaxDamage" INTEGER NOT NULL,
    "weaponDamageString" TEXT NOT NULL,
    "weaponDamageType" TEXT NOT NULL,
    "weaponDamageName" TEXT NOT NULL,
    "weaponAttackSpeed" DOUBLE PRECISION NOT NULL,
    "weaponAttackString" TEXT NOT NULL,
    "weaponDps" DOUBLE PRECISION NOT NULL,
    "weaponDpsString" TEXT NOT NULL,
    "sellPriceValue" INTEGER NOT NULL,
    "sellPriceHeader" TEXT NOT NULL,
    "sellPriceGold" TEXT NOT NULL,
    "sellPriceSilver" TEXT NOT NULL,
    "sellPriceCopper" TEXT NOT NULL,
    "levelValue" INTEGER NOT NULL,
    "levelString" TEXT NOT NULL,
    "isSubclassHidden" BOOLEAN NOT NULL,
    "rewardType" TEXT NOT NULL,
    "rewardName" TEXT NOT NULL,
    "rewardQuantity" INTEGER NOT NULL,
    "rewardTitleType" TEXT NOT NULL,
    "rewardTitleId" INTEGER NOT NULL,
    "rewardTitleName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreviewItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blizzAPIItem_previewItemId_key" ON "blizzAPIItem"("previewItemId");

-- AddForeignKey
ALTER TABLE "rcLootItem" ADD CONSTRAINT "rcLootItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "blizzAPIItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blizzAPIItem" ADD CONSTRAINT "blizzAPIItem_previewItemId_fkey" FOREIGN KEY ("previewItemId") REFERENCES "PreviewItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
