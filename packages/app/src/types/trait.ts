import { Nom } from "./nom";

export type Trait = {
  id: string;
  name: string;
  type: string;
  svg: string;
  description: string;
  creator: string;
  rleBytes: string;
  mintModuleAddress: string;
};

export type NomTrait = {
  id: string;
  quantity: number;
  equipped: boolean;
  nom: Nom;
  trait: Trait;
};
