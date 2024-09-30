import { Nom } from "./nom";

export type Trait = {
  id: number;
  name: string;
  svg: string;
  rleBytes: string;
};

export type NomTrait = {
  id: string;
  quantity: number;
  equipped: boolean;
  nom: Nom;
  trait: Trait;
};
