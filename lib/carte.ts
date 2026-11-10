import carte from "@/data/carte.json";
import type { Dict } from "@/lib/i18n";

export type Tag = "veggie";
export type Illus = "kebab" | "durum" | "tacos" | "plate" | "burger" | "menu" | "salad" | "fries" | "can" | "bottle";
export type Item = { price: number | null; illus: Illus; sauce: boolean; tags: Tag[]; photo: string[]; star?: boolean };
export type ItemId = keyof typeof carte.items;
export type CategoryId = "kebab" | "durum" | "tacos" | "assiettes" | "burgers" | "menus" | "salades" | "boissons";
export type SauceId = keyof Dict["carte"]["sauces"];

export const ITEMS = carte.items as unknown as Record<ItemId, Item>;
export const ITEM_IDS = Object.keys(ITEMS) as ItemId[];
export const SAUCES = carte.sauces as SauceId[];
export const isItem = (v: unknown): v is ItemId => typeof v === "string" && v in ITEMS;

/** Onglets de la carte (data/carte.json). */
export const categories = () => carte.categories as { id: CategoryId; items: ItemId[] }[];

/** Prix d'un plat ; null tant qu'il n'est pas renseigné. */
export const unitPrice = (id: ItemId) => ITEMS[id].price;

export const checked = carte.checked;
