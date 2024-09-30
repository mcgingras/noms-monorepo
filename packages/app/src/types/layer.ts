import { Trait } from "./trait";

export enum LayerChangeType {
  BUY_AND_EQUIP = "BUY_AND_EQUIP",
  EQUIP = "EQUIP",
  UNEQUIP = "UNEQUIP",
  FIXED = "FIXED",
}

export type Layer = {
  trait: Trait;
  owned: boolean;
  equipped: boolean;
  type: LayerChangeType;
};
