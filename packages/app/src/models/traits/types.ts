export type Trait = {
  id: string;
  type: TraitType;
  svg: string;
  rleBytes: string;
  name: string;
};

export enum TraitType {
  HEAD = "head",
  BODY = "body",
  ACCESSORY = "accessory",
  BACKGROUND = "background",
  GLASSES = "glasses",
}
