/*
  Warnings:

  - You are about to drop the column `itemClassHref` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemClassId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemSubclassHref` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemSubclassId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewIitemClassHref` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewItemClassId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewItemClassName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewItemId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewItemSubclassHref` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewItemSubclassId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewItemSubclassName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewLevelString` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewLevelValue` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewMediaHref` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewMediaId` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewQualityName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewQualityType` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponAttackSpeed` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponAttackString` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponDamageName` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponDamageString` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponDamageType` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponDps` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponDpsString` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponMaxDamage` on the `blizzAPIItem` table. All the data in the column will be lost.
  - You are about to drop the column `previewWeaponMinDamage` on the `blizzAPIItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blizzAPIItem" DROP COLUMN "itemClassHref",
DROP COLUMN "itemClassId",
DROP COLUMN "itemSubclassHref",
DROP COLUMN "itemSubclassId",
DROP COLUMN "mediaId",
DROP COLUMN "previewIitemClassHref",
DROP COLUMN "previewItemClassId",
DROP COLUMN "previewItemClassName",
DROP COLUMN "previewItemId",
DROP COLUMN "previewItemSubclassHref",
DROP COLUMN "previewItemSubclassId",
DROP COLUMN "previewItemSubclassName",
DROP COLUMN "previewLevelString",
DROP COLUMN "previewLevelValue",
DROP COLUMN "previewMediaHref",
DROP COLUMN "previewMediaId",
DROP COLUMN "previewName",
DROP COLUMN "previewQualityName",
DROP COLUMN "previewQualityType",
DROP COLUMN "previewWeaponAttackSpeed",
DROP COLUMN "previewWeaponAttackString",
DROP COLUMN "previewWeaponDamageName",
DROP COLUMN "previewWeaponDamageString",
DROP COLUMN "previewWeaponDamageType",
DROP COLUMN "previewWeaponDps",
DROP COLUMN "previewWeaponDpsString",
DROP COLUMN "previewWeaponMaxDamage",
DROP COLUMN "previewWeaponMinDamage",
ADD COLUMN     "bindingName" TEXT,
ADD COLUMN     "bindingType" TEXT,
ADD COLUMN     "previewArmor" JSONB,
ADD COLUMN     "previewRequirements" JSONB,
ADD COLUMN     "previewSet" JSONB,
ADD COLUMN     "previewSpells" JSONB,
ADD COLUMN     "previewStats" JSONB,
ADD COLUMN     "previewWeapon" JSONB,
ADD COLUMN     "uniqueEquipped" TEXT;
