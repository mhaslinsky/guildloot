// @ts-nocheck
import { prisma } from "../../server/db/client";
import { blizzAPIItem, blizzAPIMedia, PreviewItem } from "../types";

export default async function createBlizzAPIItem(item: blizzAPIItem & blizzAPIMedia) {
  try {
    await prisma.blizzAPIItem.create({
      data: {
        id: item.id,
        name: item.name,
        qualityType: item.quality.type != null ? item.quality.type : undefined,
        level: item.level != null ? item.level : undefined,
        requiredLevel: item.required_level != null ? item.required_level : undefined,
        mediaHref: item.media.key.href != null ? item.media.key.href : undefined,
        itemClassName: item.item_class.name != null ? item.item_class.name : undefined,
        itemSubclassName: item.item_subclass.name != null ? item.item_subclass.name : undefined,
        inventoryType: item.inventory_type.type != null ? item.inventory_type.type : undefined,
        inventoryName: item.inventory_type.name != null ? item.inventory_type.name : undefined,
        //PreviewItem
        previewArmor: item.preview_item.armor != null ? item.preview_item.armor : undefined,
        previewWeapon: item.preview_item.weapon != null ? item.preview_item.weapon : undefined,
        previewStats: item.preview_item.stats != null ? item.preview_item.stats : undefined,
        previewSpells: item.preview_item.spells != null ? item.preview_item.spells : undefined,
        previewRequirements: item.preview_item.requirements != null ? item.preview_item.requirements : undefined,
        previewSet: item.preview_item.set != null ? item.preview_item.set : undefined,
        // Media
        thumbnail: item.assets[0].value != null ? item.assets[0].value : undefined,
      },
    });
  } catch (error) {
    throw error;
  }
}
