/*
  Warnings:

  - You are about to drop the column `href` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `isEquippable` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `isStackable` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `maxCount` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewBindingName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewBindingType` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewInventoryName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewInventoryType` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewIsSubclassHidden` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewRewardName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewRewardQuantity` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewRewardTitleId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewRewardTitleName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewRewardTitleType` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewRewardType` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewSellPriceCopper` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewSellPriceGold` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewSellPriceHeader` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewSellPriceSilver` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewSellPriceValue` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewUniqueEquipped` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `purchasePrice` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `sellPrice` on the `blizzAPIItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blizzAPIItem" DROP COLUMN "href",
DROP COLUMN "isEquippable",
DROP COLUMN "isStackable",
DROP COLUMN "maxCount",
DROP COLUMN "previewBindingName",
DROP COLUMN "previewBindingType",
DROP COLUMN "previewInventoryName",
DROP COLUMN "previewInventoryType",
DROP COLUMN "previewIsSubclassHidden",
DROP COLUMN "previewRewardName",
DROP COLUMN "previewRewardQuantity",
DROP COLUMN "previewRewardTitleId",
DROP COLUMN "previewRewardTitleName",
DROP COLUMN "previewRewardTitleType",
DROP COLUMN "previewRewardType",
DROP COLUMN "previewSellPriceCopper",
DROP COLUMN "previewSellPriceGold",
DROP COLUMN "previewSellPriceHeader",
DROP COLUMN "previewSellPriceSilver",
DROP COLUMN "previewSellPriceValue",
DROP COLUMN "previewUniqueEquipped",
DROP COLUMN "purchasePrice",
DROP COLUMN "sellPrice";
