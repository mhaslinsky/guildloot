// @ts-nocheck
import { prisma } from "../../server/db/client";
import { blizzAPIItem, blizzAPIMedia, PreviewItem } from "../types";

export default async function createBlizzAPIItem(item: blizzAPIItem & blizzAPIMedia) {
  try {
    await prisma.blizzAPIItem.create({
      data: {
        id: item.id,
        name: item.name,
        qualityType: item.quality.type,
        level: item.level,
        requiredLevel: item.required_level,
        mediaHref: item.media.key.href,
        itemClassName: item.item_class.name,
        itemSubclassName: item.item_subclass.name,
        inventoryType: item.inventory_type.type,
        inventoryName: item.inventory_type.name,
        //PreviewItem
        previewArmor: item.preview_item.armor != null ? item.preview_item.armor : undefined,
        previewWeapon: item.preview_item.weapon != null ? item.preview_item.weapon : undefined,
        previewStats: item.preview_item.stats != null ? item.preview_item.stats : undefined,
        previewSpells: item.preview_item.spells != null ? item.preview_item.spells : undefined,
        previewRequirements: item.preview_item.requirements != null ? item.preview_item.requirements : undefined,
        previewSet: item.preview_item.set != null ? item.preview_item.set : undefined,
        // Media
        thumbnail: item.assets[0].value,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
