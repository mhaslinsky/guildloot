/*
  Warnings:

  - You are about to drop the `PreviewItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `previewBindingName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewBindingType` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewIitemClassHref` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewInventoryName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewInventoryType` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewIsSubclassHidden` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewItemClassId` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewItemClassName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewItemSubclassHref` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewItemSubclassId` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewItemSubclassName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewLevelString` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewLevelValue` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewMediaHref` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewMediaId` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewQualityName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewQualityType` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewRewardName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewRewardQuantity` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewRewardTitleId` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewRewardTitleName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewRewardTitleType` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewRewardType` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewSellPriceCopper` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewSellPriceGold` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewSellPriceHeader` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewSellPriceSilver` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewSellPriceValue` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewUniqueEquipped` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponAttackSpeed` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponAttackString` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponDamageName` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponDamageString` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponDamageType` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponDps` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponDpsString` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponMaxDamage` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewWeaponMinDamage` to the `blizzAPIItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blizzAPIItem" DROP CONSTRAINT "blizzAPIItem_previewItemId_fkey";

-- DropIndex
DROP INDEX "blizzAPIItem_previewItemId_key";

-- AlterTable
ALTER TABLE "blizzAPIItem" ADD COLUMN     "previewBindingName" TEXT NOT NULL,
ADD COLUMN     "previewBindingType" TEXT NOT NULL,
ADD COLUMN     "previewIitemClassHref" TEXT NOT NULL,
ADD COLUMN     "previewInventoryName" TEXT NOT NULL,
ADD COLUMN     "previewInventoryType" TEXT NOT NULL,
ADD COLUMN     "previewIsSubclassHidden" BOOLEAN NOT NULL,
ADD COLUMN     "previewItemClassId" INTEGER NOT NULL,
ADD COLUMN     "previewItemClassName" TEXT NOT NULL,
ADD COLUMN     "previewItemSubclassHref" TEXT NOT NULL,
ADD COLUMN     "previewItemSubclassId" INTEGER NOT NULL,
ADD COLUMN     "previewItemSubclassName" TEXT NOT NULL,
ADD COLUMN     "previewLevelString" TEXT NOT NULL,
ADD COLUMN     "previewLevelValue" INTEGER NOT NULL,
ADD COLUMN     "previewMediaHref" TEXT NOT NULL,
ADD COLUMN     "previewMediaId" INTEGER NOT NULL,
ADD COLUMN     "previewName" TEXT NOT NULL,
ADD COLUMN     "previewQualityName" TEXT NOT NULL,
ADD COLUMN     "previewQualityType" TEXT NOT NULL,
ADD COLUMN     "previewRewardName" TEXT NOT NULL,
ADD COLUMN     "previewRewardQuantity" INTEGER NOT NULL,
ADD COLUMN     "previewRewardTitleId" INTEGER NOT NULL,
ADD COLUMN     "previewRewardTitleName" TEXT NOT NULL,
ADD COLUMN     "previewRewardTitleType" TEXT NOT NULL,
ADD COLUMN     "previewRewardType" TEXT NOT NULL,
ADD COLUMN     "previewSellPriceCopper" TEXT NOT NULL,
ADD COLUMN     "previewSellPriceGold" TEXT NOT NULL,
ADD COLUMN     "previewSellPriceHeader" TEXT NOT NULL,
ADD COLUMN     "previewSellPriceSilver" TEXT NOT NULL,
ADD COLUMN     "previewSellPriceValue" INTEGER NOT NULL,
ADD COLUMN     "previewUniqueEquipped" TEXT NOT NULL,
ADD COLUMN     "previewWeaponAttackSpeed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "previewWeaponAttackString" TEXT NOT NULL,
ADD COLUMN     "previewWeaponDamageName" TEXT NOT NULL,
ADD COLUMN     "previewWeaponDamageString" TEXT NOT NULL,
ADD COLUMN     "previewWeaponDamageType" TEXT NOT NULL,
ADD COLUMN     "previewWeaponDps" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "previewWeaponDpsString" TEXT NOT NULL,
ADD COLUMN     "previewWeaponMaxDamage" INTEGER NOT NULL,
ADD COLUMN     "previewWeaponMinDamage" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "blizzAPIItem_id_seq";

-- DropTable
DROP TABLE "PreviewItem";
